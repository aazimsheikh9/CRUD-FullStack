import { createConnection } from "@/app/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "failed",
      statusCode: 0,
      message: `Request method '${req.method}' not supported`,
      error: "Method Not Allowed",
    });
  }

  const { id } = req.query;

  let connection;
  try {
    const pool = createConnection();
    connection = await pool.getConnection();

    let query = "SELECT ID, NAME, EMAIL FROM USER WHERE STATUS = 'Y'";
    let values = [];

    if (id) {
      query += "AND ID = ?";
      values.push(id);
    }

    const [rows] = await connection.execute(query, values);

    connection.release();

    if (rows.length > 0) {
      return res.status(200).json({
        status: "success",
        total: rows.length,
        statusCode: 1,
        data: id ? rows[0] : rows,
        message: "Users Found Successfully",
      });
    } else {
      return res.status(404).json({
        status: "failed",
        statusCode: 0,
        message: "No entries found for the given parameters",
        error: "Not Found",
      });
    }
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
