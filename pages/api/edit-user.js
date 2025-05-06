import { createConnection } from "@/app/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "failed",
      statusCode: 0,
      message: `Request method '${req.method}' not supported`,
      error: "Method Not Allowed",
    });
  }

  const { name, email, userId } = req.body;

  if (!name || !email || !userId) {
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
      "SELECT ID FROM USER WHERE EMAIL = ? AND ID != ?",
      [email, userId]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({
        status: "failed",
        statusCode: 0,
        message: "User with this email already exists.",
      });
    }

    const deactivateQuery = "UPDATE USER SET STATUS = 'E' WHERE ID = ?";
    const [deactivateResult] = await connection.execute(deactivateQuery, [
      userId,
    ]);

    if (deactivateResult.affectedRows === 0) {
      return res.status(404).json({
        status: "failed",
        statusCode: 0,
        message: "User not found.",
      });
    }

    const [user] = await connection.execute(
      "SELECT PASSWORD FROM USER WHERE ID = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({
        status: "failed",
        statusCode: 0,
        message: "User not found.",
      });
    }

    const existingPassword = user[0].PASSWORD;

    const insertQuery =
      "INSERT INTO USER (NAME, EMAIL, PASSWORD, STATUS) VALUES (?, ?, ?, 'Y')";
    const values = [name, email, existingPassword];

    const [insertResult] = await connection.execute(insertQuery, values);

    return res.status(200).json({
      status: "success",
      statusCode: 1,
      message: "User updated successfully",
      userId: insertResult.insertId,
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
