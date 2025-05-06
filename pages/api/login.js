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

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      statusCode: 0,
      message: "Email and password are required.",
    });
  }

  let connection;
  try {
    const pool = createConnection();
    connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT * FROM USER WHERE EMAIL = ? AND STATUS = 'Y' LIMIT 0,1",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: "failed",
        statusCode: 0,
        message: "Invalid email or user does not exist.",
      });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        statusCode: 0,
        message: "Invalid email or password.",
      });
    }

    const { PASSWORD, STATUS, ...userWithoutSensitiveData } = user;

    return res.status(200).json({
      status: "success",
      statusCode: 1,
      message: "Login successful",
      user: userWithoutSensitiveData,
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
