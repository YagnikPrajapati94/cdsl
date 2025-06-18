import { db } from "../../lib/db";
export default function handler(req, res) {
  const {
    query: { id }, method, body
  } = req

  if (method === "PUT") {
    const jsonData = JSON.stringify(body)
    const sql = 'UPDATE user_data SET json_data = ? WHERE unique_id = ?';

    db.query(sql, [jsonData, id], (err, result) => {
      if (err) {
        console.error('❌ Update failed:', err);
        return res.status(500).json({ error: 'Failed to update data' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: '✅ Data updated successfully' });

    })
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ error: `Method ${method} not allowed` });
  }
}