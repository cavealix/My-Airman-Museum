const { Pool } = require('pg');

exports.handler = async (event) => {
  const query = event.queryStringParameters?.q || '';  // e.g., ?q=brick123

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing query parameter q' })
    };
  }

  const pool = new Pool({
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB,
    ssl: { rejectUnauthorized: false }  // Required for RDS SSL
  });

  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT * FROM "Bricks" 
       WHERE "Paver_Lines" ILIKE $1 OR "Name_Key"::text ILIKE $1 
       AND "Lat" IS NOT NULL AND "Lon" IS NOT NULL`,
      [`%${query}%`]
    );

    // Dedup by Name_Key (client-side for simplicity)
    const uniqueData = Array.from(new Map(res.rows.map(item => [item.Name_Key, item])).values());

    return {
      statusCode: 200,
      body: JSON.stringify(uniqueData),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database query failed' })
    };
  } finally {
    pool.end();
  }
};