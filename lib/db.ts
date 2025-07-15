// lib/db.ts
import mysql from 'mysql2/promise';

// 환경변수에서 DB 정보 읽기 (.env 파일 필요)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

export default pool;
