import mysql from "mysql2/promise";

export function createConnection() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET || "utf8mb4",
    connectionLimit: 10,
  });
  return pool;
}
