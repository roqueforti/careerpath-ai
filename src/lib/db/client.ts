import { createClient, Client as LibSqlClient } from "@libsql/client";
import { Pool, PoolConfig } from "pg";
import fs from "fs";
import path from "path";

export interface DatabaseResult {
  rows: any[];
  columns?: string[];
}

export interface DatabaseClient {
  execute(stmt: string | { sql: string; args?: any[] }): Promise<DatabaseResult>;
}

let dbInstance: DatabaseClient | null = null;

class PgDatabaseClient implements DatabaseClient {
  private pool: Pool;

  constructor(connectionStringOrConfig: string | PoolConfig) {
    if (typeof connectionStringOrConfig === "string") {
      const isRemote =
        !connectionStringOrConfig.includes("127.0.0.1") &&
        !connectionStringOrConfig.includes("localhost");

      this.pool = new Pool({
        connectionString: connectionStringOrConfig,
        ssl: isRemote ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
    } else {
      this.pool = new Pool(connectionStringOrConfig);
    }
  }

  async execute(stmt: string | { sql: string; args?: any[] }): Promise<DatabaseResult> {
    let sql = typeof stmt === "string" ? stmt : stmt.sql;
    const args = typeof stmt === "string" ? [] : stmt.args || [];

    // 1. Transform SQLite datetime('now', '<offset>') -> (NOW() + INTERVAL '<offset>')
    sql = sql.replace(
      /\bdatetime\s*\(\s*['"]now['"]\s*,\s*['"]([+-]?\d+)\s*(days?|months?|years?|hours?|minutes?|seconds?)['"]\s*\)/gi,
      "(NOW() + INTERVAL '$1 $2')"
    );
    // Transform SQLite datetime('now') -> CURRENT_TIMESTAMP
    sql = sql.replace(/\bdatetime\s*\(\s*['"]now['"]\s*\)/gi, "CURRENT_TIMESTAMP");
    sql = sql.replace(/\(datetime\('now'\)\)/gi, "CURRENT_TIMESTAMP");

    // 2. Transform INSERT OR REPLACE INTO <table> (<cols>) VALUES (<vals>)
    if (/INSERT\s+OR\s+REPLACE\s+INTO/i.test(sql)) {
      const match = sql.match(/INSERT\s+OR\s+REPLACE\s+INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
      if (match) {
        const table = match[1];
        const cols = match[2].split(",").map((c) => c.trim());
        const otherCols = cols.filter((c) => c.toLowerCase() !== "id");
        const updateClauses = otherCols.map((c) => `"${c}" = EXCLUDED."${c}"`).join(", ");
        sql = `INSERT INTO ${table} (${cols.map((c) => `"${c}"`).join(", ")}) VALUES (${match[3]}) ON CONFLICT (id) DO UPDATE SET ${updateClauses}`;
      }
    }

    // 3. Transform SQLite ? placeholders to PG $1, $2, $3...
    if (args && args.length > 0) {
      let paramIndex = 1;
      sql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    }

    try {
      const res = await this.pool.query(sql, args);
      return {
        rows: res.rows,
        columns: res.fields ? res.fields.map((f) => f.name) : [],
      };
    } catch (err: any) {
      // Ignore concurrent DDL collisions (e.g. Next.js multi-process dev startup)
      if (
        (err?.code === "23505" || err?.code === "42P07" || err?.code === "42710") &&
        /CREATE\s+(TABLE|INDEX)/i.test(sql)
      ) {
        return { rows: [], columns: [] };
      }
      throw err;
    }
  }
}

class LibSqlDatabaseClient implements DatabaseClient {
  private client: LibSqlClient;

  constructor(url: string) {
    this.client = createClient({ url });
  }

  async execute(stmt: string | { sql: string; args?: any[] }): Promise<DatabaseResult> {
    const res = await this.client.execute(stmt);
    return {
      rows: res.rows as any[],
      columns: res.columns,
    };
  }
}

export function getDb(): DatabaseClient {
  if (dbInstance) {
    return dbInstance;
  }

  const dbUrl = process.env.DATABASE_URL || "file:data/careerpath.db";

  if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
    dbInstance = new PgDatabaseClient(dbUrl);
    return dbInstance;
  }

  // Fallback to SQLite LibSQL
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  dbInstance = new LibSqlDatabaseClient(dbUrl);
  return dbInstance;
}
