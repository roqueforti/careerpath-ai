import { getDb } from "../db/client";

export async function logAudit(
  userId: string | null,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  try {
    const db = getDb();
    const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await db.execute({
      sql: `INSERT INTO audit_logs (id, user_id, action, resource, resource_id, details_json, ip_address) 
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
      args: [
        id,
        userId,
        action,
        resource,
        resourceId || null,
        details ? JSON.stringify(details) : null,
        ipAddress || "127.0.0.1",
      ],
    });
  } catch (err) {
    console.error("Audit log writing failed:", err);
  }
}

export async function getAuditLogs(limit = 50): Promise<Array<Record<string, unknown>>> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT a.*, u.email as user_email, u.full_name as user_name 
          FROM audit_logs a 
          LEFT JOIN users u ON a.user_id = u.id 
          ORDER BY a.created_at DESC 
          LIMIT ?;`,
    args: [limit],
  });
  return res.rows as unknown as Array<Record<string, unknown>>;
}
