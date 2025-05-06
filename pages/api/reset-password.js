import { createConnection } from "@/app/utils/dbConnection";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "failed",
      statusCode: 0,
      message: `Request method '${req.method}' not supported`,
      error: "Method Not Allowed",
    });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Unauthorized. Only admins can perform this action." });
  }

  const { email, currentPassword, newPassword, confirmPassword } = req.body;

  if (!email || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      status: "failed",
      statusCode: 0,
      message: "All fields are required.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: "failed",
      statusCode: 0,
      message: "New password and confirmation password do not match.",
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

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.PASSWORD
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        statusCode: 0,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.execute(
      "UPDATE USER SET PASSWORD = ? WHERE EMAIL = ? AND STATUS = 'Y'",
      [hashedPassword, email]
    );

    return res.status(200).json({
      status: "success",
      statusCode: 1,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      statusCode: 0,
      message: "Database query failed.",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
}
