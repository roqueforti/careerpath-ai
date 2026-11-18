const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

function getConnectionString() {
  // 1. CLI argument: node scripts/migrate-pg.js "postgresql://..."
  if (process.argv[2] && (process.argv[2].startsWith("postgres://") || process.argv[2].startsWith("postgresql://"))) {
    return process.argv[2];
  }

  // 2. process.env.DATABASE_URL
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // 3. .env.local or .env
  const candidateFiles = [".env.local", ".env"];
  for (const f of candidateFiles) {
    const filePath = path.join(__dirname, "..", f);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [k, ...v] = trimmed.split("=");
          if (k.trim() === "DATABASE_URL") {
            return v.join("=").replace(/^["']|["']$/g, "").trim();
          }
        }
      }
    }
  }

  // 4. Default fallback
  return "postgresql://postgres@127.0.0.1:5432/careerpath_ai_db";
}

function maskConnectionString(uri) {
  try {
    return uri.replace(/:([^:@]+)@/, ":****@");
  } catch {
    return "postgresql://****";
  }
}

async function migrateAndSeedPostgres() {
  const connectionString = getConnectionString();
  const maskedUri = maskConnectionString(connectionString);

  console.log(`Connecting to PostgreSQL database: ${maskedUri}...`);

  const isRemote =
    !connectionString.includes("127.0.0.1") &&
    !connectionString.includes("localhost");

  const pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 15000,
  });

  try {
    const connCheck = await pool.query("SELECT current_user, current_database(), version();");
    console.log("Connected successfully to PostgreSQL!");
    console.log(`User: ${connCheck.rows[0].current_user} | Database: ${connCheck.rows[0].current_database()}`);

    // Read supabase-schema.sql
    const sqlPath = path.join(__dirname, "..", "supabase-schema.sql");
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Schema file not found at: ${sqlPath}`);
    }

    const fullSql = fs.readFileSync(sqlPath, "utf-8");
    console.log("Executing schema DDL and baseline catalog seed...");

    // Execute the full schema script
    await pool.query(fullSql);
    console.log("All tables, constraints, indexes, and baseline seed data created successfully!");

    // Verification
    const countCheck = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users_count,
        (SELECT COUNT(*) FROM occupations) as occupations_count,
        (SELECT COUNT(*) FROM assessment_questions) as questions_count,
        (SELECT COUNT(*) FROM opportunities) as opportunities_count;
    `);

    console.log("\nDatabase Verification Summary:");
    console.log(`- Registered Users: ${countCheck.rows[0].users_count}`);
    console.log(`- Curated Occupations: ${countCheck.rows[0].occupations_count}`);
    console.log(`- RIASEC Assessment Questions: ${countCheck.rows[0].questions_count}`);
    console.log(`- Active Opportunities: ${countCheck.rows[0].opportunities_count}`);
    console.log("\nSupabase database setup is 100% COMPLETE and ready for production!\n");

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("\nDatabase migration error:", err.message);
    if (err.code === "ECONNREFUSED") {
      console.error("Tip: Check whether your PostgreSQL or Supabase host is reachable.");
    } else if (err.code === "28P01") {
      console.error("Tip: Password authentication failed. Check your Supabase database password in DATABASE_URL.");
    }
    await pool.end();
    process.exit(1);
  }
}

migrateAndSeedPostgres();
