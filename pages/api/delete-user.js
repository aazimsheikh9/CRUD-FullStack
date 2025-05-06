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

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      status: "failed",
      statusCode: 0,
      message: "Failed to delete",
    });
  }

  let connection;
  try {
    const pool = createConnection();
    connection = await pool.getConnection();

    const query = "UPDATE USER SET STATUS = 'D' WHERE ID = ?";
    const values = [userId];

    const [result] = await connection.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "failed",
        statusCode: 0,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      statusCode: 1,
      message: "User deleted successfully",
      userId: userId,
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
