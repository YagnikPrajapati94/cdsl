import { db } from "../lib/db";
export default function handler(req,res) {
    if (req.method === "GET") {
        const sql = 'SELECT * FROM user_data'
        db.query(sql,(err,result)=>{
            if (err) {
                console.error('❌ Failed to Fetch',err);
                return res.status(500).json({error:"Failed to Get Data"})
            }

            const parsed = result.map((row)=>({
                id:row.id,
                data:JSON.parse(row.json_data)
            }))
            res.status(200).json(parsed)

        })
    } else {
        return res.status(405).json({error:"'Only Get Method allowed"})
    }
}