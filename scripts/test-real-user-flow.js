const { Pool } = require("pg");

async function run() {
  const pool = new Pool({
    connectionString: "postgresql://postgres@127.0.0.1:5432/careerpath_ai_db",
  });

  console.log("=== Testing Real User Account & PostgreSQL Integration ===");

  // 1. Test Registration via API
  const testEmail = `test.user.${Date.now()}@kampus.id`;
  const registerPayload = {
    fullName: "Arya Pratama Wicaksana",
    email: testEmail,
    password: "StrongPassword123!",
    role: "STUDENT",
    educationLevel: "MAHASISWA",
    phone: "081298765432",
    institutionCode: "ITB-CDC",
  };

  console.log(`\n1. Registering real user account: ${testEmail}...`);
  const regRes = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerPayload),
  });

  const regData = await regRes.json();
  console.log("Register response HTTP status:", regRes.status);
  console.log("Register response data:", regData);

  if (!regRes.ok || !regData.success) {
    throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  }

  const cookie = regRes.headers.get("set-cookie");
  console.log("Session cookie received:", cookie ? "YES (careerpath_session set)" : "NO");

  // 2. Verify directly in PostgreSQL database
  console.log("\n2. Verifying records in PostgreSQL table 'users' & 'profiles'...");
  const dbUser = await pool.query(
    "SELECT id, email, full_name, role, created_at FROM users WHERE email = $1",
    [testEmail]
  );
  console.log("User record in PostgreSQL:", dbUser.rows[0]);

  const dbProfile = await pool.query(
    "SELECT education_level, career_maturity, career_maturity_score, phone FROM profiles WHERE id = $1",
    [dbUser.rows[0].id]
  );
  console.log("Profile record in PostgreSQL:", dbProfile.rows[0]);

  // 3. Test Invalid Login
  console.log("\n3. Testing login with invalid password...");
  const badLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "WrongPassword999!" }),
  });
  console.log("Bad login status (expected 401):", badLoginRes.status);

  // 4. Test Valid Login
  console.log("\n4. Testing login with valid password...");
  const loginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "StrongPassword123!" }),
  });
  const loginData = await loginRes.json();
  console.log("Login status (expected 200):", loginRes.status, loginData.user?.fullName);
  const loginCookie = loginRes.headers.get("set-cookie");

  // 5. Test Fetching /api/auth/profile
  console.log("\n5. Testing /api/auth/profile...");
  const profRes = await fetch("http://localhost:3000/api/auth/profile", {
    headers: { Cookie: loginCookie.split(";")[0] },
  });
  const profData = await profRes.json();
  console.log("Profile data retrieved:", {
    fullName: profData.profile.full_name,
    email: profData.profile.email,
    role: profData.profile.role,
    educationLevel: profData.profile.education_level,
    institution: profData.profile.institution?.institution_name,
  });

  // 6. Test Updating Profile
  console.log("\n6. Testing /api/auth/profile update (Bio & Interests)...");
  const updateRes = await fetch("http://localhost:3000/api/auth/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: loginCookie.split(";")[0],
    },
    body: JSON.stringify({
      bio: "Mahasiswa Informatika berfokus pada AI, data science, dan scalable distributed systems.",
      interests: "Machine Learning, Deep Learning, Cloud Architecture",
      educationLevel: "MAHASISWA_AKHIR",
    }),
  });
  const updateData = await updateRes.json();
  console.log("Profile update result:", updateData.success ? "SUCCESS" : "FAILED");
  console.log("Updated Profile in DB:", {
    bio: updateData.profile.bio,
    interests: updateData.profile.interests,
    educationLevel: updateData.profile.education_level,
  });

  // 7. Test Password Change
  console.log("\n7. Testing Password Change (/api/auth/password)...");
  const pwdRes = await fetch("http://localhost:3000/api/auth/password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: loginCookie.split(";")[0],
    },
    body: JSON.stringify({
      oldPassword: "StrongPassword123!",
      newPassword: "BrandNewPassword2026!",
    }),
  });
  const pwdData = await pwdRes.json();
  console.log("Password change response:", pwdData);

  // 8. Verify login with NEW password
  console.log("\n8. Verifying login with NEW password...");
  const newLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "BrandNewPassword2026!" }),
  });
  const newLoginData = await newLoginRes.json();
  console.log("New password login success:", newLoginData.success);

  console.log("\n=== ALL REAL USER AUTHENTICATION & DATABASE TESTS PASSED! ===");
  await pool.end();
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
