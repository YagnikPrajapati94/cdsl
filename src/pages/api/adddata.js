import { db } from "../lib/db";

function generateUniqueId(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const uniqueId = generateUniqueId(10); // e.g., "a3X9kL8ZrT"
    const jsonData = JSON.stringify(req.body);

    const sql = 'INSERT INTO user_data (unique_id, json_data) VALUES (?, ?)';
    const values = [uniqueId, jsonData];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Insert failed ❌:', err);
        return res.status(500).json({ error: 'Failed to insert data' });
      }

      res.status(201).json({
        message: '✅ Data inserted',
        // mysqlInsertId: result.insertId,
        uniqueId
      });
    });
  } else {
    res.status(405).json({ error: 'Only POST method allowed' });
  }
}
