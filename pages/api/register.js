import { createConnection } from "@/app/utils/dbConnection";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "failed",
      statusCode: 0,
      message: `Request method '${req.method}' not supported`,
      error: "Method Not Allowed",
    });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "failed",
      statusCode: 0,
      message: "All fields are required.",
    });
  }

  let connection;
  try {
    const pool = createConnection();
    connection = await pool.getConnection();

    const [existingUser] = await connection.execute(
      "SELECT ID FROM USER WHERE EMAIL = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({
        status: "failed",
        statusCode: 0,
        message: "User with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO USER (NAME, EMAIL, PASSWORD, STATUS) VALUES (?, ?, ?, 'Y')";
    const values = [name, email, hashedPassword];

    const [result] = await connection.execute(query, values);

    return res.status(200).json({
      status: "success",
      statusCode: 1,
      message: "User added successfully",
      userId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      statusCode: 0,
      message: "Database query failed",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
}
