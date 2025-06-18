import { db } from "../../lib/db";
export default function handler(req, res) {
    const {
        query: { id }, method,
    } = req;

    if (method === 'GET') {
        const sql = 'SELECT * FROM user_data WHERE unique_id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('❌ DB error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = {
                id: results[0].id,
                data: JSON.parse(results[0].json_data),
            };

            res.status(200).json(user);
        });

    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${method} not allowed` });
    }
}