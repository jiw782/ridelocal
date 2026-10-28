import pg from "pg";

// Render's hosted database requires SSL; the local one doesn't
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});
export default db;
