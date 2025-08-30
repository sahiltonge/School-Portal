import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = mysql.createPool(dbConfig);

// Test connection
(async () => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("MySQL Connected Successfully:", rows);
  } catch (err) {
    console.error("MySQL Connection Failed:", err);
  }
})();

export default db;
