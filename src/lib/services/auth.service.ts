import { getDb } from "../db/client";
import { setSessionCookie, clearSessionCookie, SessionUser } from "../auth/session";
import bcrypt from "bcryptjs";
import { logAudit } from "./audit.service";

export async function loginUser(
  email: string,
  passwordPlain: string
): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT u.*, p.education_level, p.career_maturity 
          FROM users u 
          LEFT JOIN profiles p ON u.id = p.id 
          WHERE u.email = ?;`,
    args: [email.toLowerCase().trim()],
  });

  const row = res.rows[0];
  if (!row) {
    return { success: false, error: "Email atau kata sandi tidak ditemukan." };
  }

  const isMatch = await bcrypt.compare(passwordPlain, String(row.password_hash));
  if (!isMatch) {
    return { success: false, error: "Email atau kata sandi tidak valid." };
  }

  const sessionUser: SessionUser = {
    id: String(row.id),
    email: String(row.email),
    fullName: String(row.full_name),
    role: row.role as SessionUser["role"],
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    educationLevel: row.education_level ? String(row.education_level) : undefined,
    careerMaturity: row.career_maturity ? String(row.career_maturity) : undefined,
  };

  await setSessionCookie(sessionUser);
  await logAudit(sessionUser.id, "USER_LOGIN", "users", sessionUser.id, { email: sessionUser.email });

  return { success: true, user: sessionUser };
}

export interface RegisterUserData {
  email: string;
  passwordPlain: string;
  fullName: string;
  role?: "STUDENT" | "MENTOR" | "INSTITUTION_ADMIN";
  educationLevel?: "SMP" | "SMA" | "SMK" | "MA" | "MAHASISWA" | "MAHASISWA_AKHIR" | "UMUM";
  institutionCode?: string;
  phone?: string;
  bio?: string;
}

export async function registerUser(
  data: RegisterUserData
): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  const db = getDb();
  const normalizedEmail = data.email.toLowerCase().trim();

  // Validate existing email
  const existing = await db.execute({
    sql: `SELECT id FROM users WHERE email = ?;`,
    args: [normalizedEmail],
  });

  if (existing.rows.length > 0) {
    return { success: false, error: "Alamat email ini sudah terdaftar. Silakan gunakan alamat email lain atau masuk." };
  }

  const role = data.role || "STUDENT";
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.passwordPlain, salt);
  const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Default career maturity based on role
  let initialMaturity = "EXPLORE";
  let initialMaturityScore = 15;
  let eduLevel = data.educationLevel || "SMA";

  if (role === "STUDENT") {
    if (eduLevel === "MAHASISWA") {
      initialMaturity = "DEVELOP";
      initialMaturityScore = 50;
    } else if (eduLevel === "MAHASISWA_AKHIR") {
      initialMaturity = "READY";
      initialMaturityScore = 75;
    } else if (eduLevel === "SMA" || eduLevel === "SMK" || eduLevel === "MA") {
      initialMaturity = "PLAN";
      initialMaturityScore = 30;
    }
  } else if (role === "MENTOR") {
    eduLevel = "UMUM";
    initialMaturity = "READY";
    initialMaturityScore = 95;
  } else if (role === "INSTITUTION_ADMIN") {
    eduLevel = "UMUM";
    initialMaturity = "READY";
    initialMaturityScore = 100;
  }

  // 1. Insert into users table
  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?);`,
    args: [userId, normalizedEmail, passwordHash, data.fullName.trim(), role],
  });

  // 2. Insert into profiles table
  await db.execute({
    sql: `INSERT INTO profiles (id, education_level, career_maturity, career_maturity_score, phone, bio) VALUES (?, ?, ?, ?, ?, ?);`,
    args: [
      userId,
      eduLevel,
      initialMaturity,
      initialMaturityScore,
      data.phone?.trim() || null,
      data.bio?.trim() || (role === "MENTOR" ? "Praktisi & Mentor Karier Terverifikasi" : null),
    ],
  });

  // 3. Link institution if code provided
  if (data.institutionCode?.trim()) {
    const inst = await db.execute({
      sql: `SELECT id, name FROM institutions WHERE code = ?;`,
      args: [data.institutionCode.trim()],
    });
    if (inst.rows.length > 0) {
      await db.execute({
        sql: `INSERT INTO institution_memberships (id, user_id, institution_id, member_role) VALUES (?, ?, ?, ?);`,
        args: [
          `mem-${Date.now()}`,
          userId,
          String(inst.rows[0].id),
          role === "INSTITUTION_ADMIN" ? "ADMIN" : role === "MENTOR" ? "MENTOR" : "STUDENT",
        ],
      });
    }
  }

  // 4. Privacy consent audit
  await db.execute({
    sql: `INSERT INTO user_consents (id, user_id, consent_type, is_granted) VALUES (?, ?, 'TERMS_OF_SERVICE', 1);`,
    args: [`consent-${Date.now()}`, userId],
  });

  const sessionUser: SessionUser = {
    id: userId,
    email: normalizedEmail,
    fullName: data.fullName.trim(),
    role: role,
    educationLevel: eduLevel,
    careerMaturity: initialMaturity,
  };

  await setSessionCookie(sessionUser);
  await logAudit(userId, "USER_REGISTER", "users", userId, { email: normalizedEmail, role });

  return { success: true, user: sessionUser };
}

export async function loginOrRegisterWithGoogle(data: {
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  role?: "STUDENT" | "MENTOR" | "INSTITUTION_ADMIN";
  educationLevel?: "SMP" | "SMA" | "SMK" | "MA" | "MAHASISWA" | "MAHASISWA_AKHIR" | "UMUM";
}): Promise<{ success: boolean; user?: SessionUser; isNewUser?: boolean; error?: string }> {
  const db = getDb();
  const normalizedEmail = data.email.toLowerCase().trim();

  // Check if user already exists
  const res = await db.execute({
    sql: `SELECT u.*, p.education_level, p.career_maturity 
          FROM users u 
          LEFT JOIN profiles p ON u.id = p.id 
          WHERE u.email = ?;`,
    args: [normalizedEmail],
  });

  if (res.rows.length > 0) {
    const row = res.rows[0];
    if (data.avatarUrl && !row.avatar_url) {
      await db.execute({
        sql: `UPDATE users SET avatar_url = ? WHERE id = ?;`,
        args: [data.avatarUrl, String(row.id)],
      });
    }

    const sessionUser: SessionUser = {
      id: String(row.id),
      email: String(row.email),
      fullName: String(row.full_name),
      role: row.role as SessionUser["role"],
      avatarUrl: data.avatarUrl || (row.avatar_url ? String(row.avatar_url) : null),
      educationLevel: row.education_level ? String(row.education_level) : undefined,
      careerMaturity: row.career_maturity ? String(row.career_maturity) : undefined,
    };

    await setSessionCookie(sessionUser);
    await logAudit(sessionUser.id, "USER_LOGIN_GOOGLE", "users", sessionUser.id, { email: sessionUser.email, provider: "google" });

    return { success: true, user: sessionUser, isNewUser: false };
  }

  // If new user, create via Google SSO
  const role = data.role || "STUDENT";
  const userId = `usr-g-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(`google-oauth-${Date.now()}-${Math.random()}`, salt);

  let initialMaturity = "EXPLORE";
  let initialMaturityScore = 15;
  let eduLevel = data.educationLevel || "MAHASISWA";

  if (role === "STUDENT") {
    if (eduLevel === "MAHASISWA") {
      initialMaturity = "DEVELOP";
      initialMaturityScore = 50;
    } else if (eduLevel === "MAHASISWA_AKHIR") {
      initialMaturity = "READY";
      initialMaturityScore = 75;
    }
  }

  // 1. Insert into users
  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, full_name, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?);`,
    args: [userId, normalizedEmail, passwordHash, data.fullName.trim(), role, data.avatarUrl || null],
  });

  // 2. Insert into profiles
  await db.execute({
    sql: `INSERT INTO profiles (id, education_level, career_maturity, career_maturity_score, bio) VALUES (?, ?, ?, ?, ?);`,
    args: [
      userId,
      eduLevel,
      initialMaturity,
      initialMaturityScore,
      "Akun terverifikasi melalui Google Sign-In.",
    ],
  });

  // 3. User consent
  await db.execute({
    sql: `INSERT INTO user_consents (id, user_id, consent_type, is_granted) VALUES (?, ?, 'TERMS_OF_SERVICE', 1);`,
    args: [`consent-g-${Date.now()}`, userId],
  });

  const sessionUser: SessionUser = {
    id: userId,
    email: normalizedEmail,
    fullName: data.fullName.trim(),
    role: role,
    avatarUrl: data.avatarUrl || null,
    educationLevel: eduLevel,
    careerMaturity: initialMaturity,
  };

  await setSessionCookie(sessionUser);
  await logAudit(userId, "USER_REGISTER_GOOGLE", "users", userId, { email: normalizedEmail, role, provider: "google" });

  return { success: true, user: sessionUser, isNewUser: true };
}

export async function registerStudent(data: {
  email: string;
  passwordPlain: string;
  fullName: string;
  educationLevel: "SMP" | "SMA" | "SMK" | "MA" | "MAHASISWA" | "MAHASISWA_AKHIR";
  institutionCode?: string;
}): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  return registerUser({
    ...data,
    role: "STUDENT",
  });
}

export async function getUserProfile(userId: string) {
  const db = getDb();

  const userRes = await db.execute({
    sql: `SELECT 
            u.id, u.email, u.full_name, u.role, u.avatar_url, u.created_at,
            p.education_level, p.career_maturity, p.career_maturity_score, 
            p.target_career_id, p.bio, p.phone, p.interests, p.is_public,
            o.title as target_career_title, o.category as target_career_category
          FROM users u
          LEFT JOIN profiles p ON u.id = p.id
          LEFT JOIN occupations o ON p.target_career_id = o.id
          WHERE u.id = ?;`,
    args: [userId],
  });

  const profile = userRes.rows[0];
  if (!profile) return null;

  // Fetch institution membership
  const instRes = await db.execute({
    sql: `SELECT im.student_id_number, im.member_role, im.joined_at, i.name as institution_name, i.code as institution_code, i.type as institution_type
          FROM institution_memberships im
          JOIN institutions i ON im.institution_id = i.id
          WHERE im.user_id = ?;`,
    args: [userId],
  });

  // Fetch recent audit activity
  const auditRes = await db.execute({
    sql: `SELECT action, resource, created_at 
          FROM audit_logs 
          WHERE user_id = ? 
          ORDER BY created_at DESC 
          LIMIT 5;`,
    args: [userId],
  });

  return {
    ...profile,
    institution: instRes.rows[0] || null,
    recentActivity: auditRes.rows,
  };
}

export async function updateUserProfile(
  userId: string,
  data: {
    fullName?: string;
    phone?: string;
    bio?: string;
    interests?: string;
    educationLevel?: "SMP" | "SMA" | "SMK" | "MA" | "MAHASISWA" | "MAHASISWA_AKHIR" | "UMUM";
    targetCareerId?: string | null;
    isPublic?: number;
    institutionCode?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const db = getDb();

  // Update users table if fullName is provided
  if (data.fullName?.trim()) {
    await db.execute({
      sql: `UPDATE users SET full_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
      args: [data.fullName.trim(), userId],
    });
  }

  // Update profiles table
  const profileUpdates: string[] = [];
  const profileArgs: any[] = [];

  if (data.phone !== undefined) {
    profileUpdates.push(`phone = ?`);
    profileArgs.push(data.phone.trim() || null);
  }
  if (data.bio !== undefined) {
    profileUpdates.push(`bio = ?`);
    profileArgs.push(data.bio.trim() || null);
  }
  if (data.interests !== undefined) {
    profileUpdates.push(`interests = ?`);
    profileArgs.push(data.interests.trim());
  }
  if (data.educationLevel) {
    profileUpdates.push(`education_level = ?`);
    profileArgs.push(data.educationLevel);
  }
  if (data.targetCareerId !== undefined) {
    profileUpdates.push(`target_career_id = ?`);
    profileArgs.push(data.targetCareerId || null);
  }
  if (data.isPublic !== undefined) {
    profileUpdates.push(`is_public = ?`);
    profileArgs.push(data.isPublic ? 1 : 0);
  }

  if (profileUpdates.length > 0) {
    profileUpdates.push(`updated_at = CURRENT_TIMESTAMP`);
    profileArgs.push(userId);
    await db.execute({
      sql: `UPDATE profiles SET ${profileUpdates.join(", ")} WHERE id = ?;`,
      args: profileArgs,
    });
  }

  // If institutionCode provided and user not yet member, attach institution
  if (data.institutionCode?.trim()) {
    const inst = await db.execute({
      sql: `SELECT id FROM institutions WHERE code = ?;`,
      args: [data.institutionCode.trim()],
    });
    if (inst.rows.length > 0) {
      await db.execute({
        sql: `INSERT INTO institution_memberships (id, user_id, institution_id, member_role)
              VALUES (?, ?, ?, 'STUDENT')
              ON CONFLICT (user_id, institution_id) DO NOTHING;`,
        args: [`mem-${Date.now()}`, userId, String(inst.rows[0].id)],
      });
    }
  }

  // Refresh active session token with new name/educationLevel
  const user = await db.execute({
    sql: `SELECT u.*, p.education_level, p.career_maturity FROM users u LEFT JOIN profiles p ON u.id = p.id WHERE u.id = ?;`,
    args: [userId],
  });
  const row = user.rows[0];
  if (row) {
    const sessionUser: SessionUser = {
      id: String(row.id),
      email: String(row.email),
      fullName: String(row.full_name),
      role: row.role as SessionUser["role"],
      avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
      educationLevel: row.education_level ? String(row.education_level) : undefined,
      careerMaturity: row.career_maturity ? String(row.career_maturity) : undefined,
    };
    await setSessionCookie(sessionUser);
  }

  await logAudit(userId, "UPDATE_PROFILE", "profiles", userId, { updated: Object.keys(data) });
  return { success: true };
}

export async function changeUserPassword(
  userId: string,
  oldPasswordPlain: string,
  newPasswordPlain: string
): Promise<{ success: boolean; error?: string }> {
  const db = getDb();

  if (newPasswordPlain.length < 6) {
    return { success: false, error: "Kata sandi baru minimal harus 6 karakter." };
  }

  const res = await db.execute({
    sql: `SELECT password_hash FROM users WHERE id = ?;`,
    args: [userId],
  });

  const row = res.rows[0];
  if (!row) {
    return { success: false, error: "Pengguna tidak ditemukan." };
  }

  const isMatch = await bcrypt.compare(oldPasswordPlain, String(row.password_hash));
  if (!isMatch) {
    return { success: false, error: "Kata sandi lama yang Anda masukkan tidak sesuai." };
  }

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(newPasswordPlain, salt);

  await db.execute({
    sql: `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
    args: [newHash, userId],
  });

  await logAudit(userId, "CHANGE_PASSWORD", "users", userId, {});
  return { success: true };
}

export async function logoutUser(): Promise<void> {
  await clearSessionCookie();
}
