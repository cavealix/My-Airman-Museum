import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Client } from 'pg';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    const query = event.queryStringParameters?.q?.trim();

    if (!query) {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify([])
        };
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL environment variable is not set");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server configuration error" })
        };
    }

    // Connect to the RDS instance
    // Remove query parameters like ?sslmode=require from the connection string to allow our ssl object config to take precedence
    const cleanDbUrl = dbUrl.split('?')[0];

    const client = new Client({
        connectionString: cleanDbUrl,
        ssl: { rejectUnauthorized: false } // Required for connecting to RDS
    });

    try {
        await client.connect();

        let dbResult;

        if (!isNaN(Number(query))) {
            // It's a number, check Name_Key or Paver_Lines
            const sql = `
        SELECT * FROM "Bricks"
        WHERE ("Paver_Lines" ILIKE $1 OR "Name_Key" = $2)
          AND "Lat" IS NOT NULL
          AND "Lon" IS NOT NULL
      `;
            dbResult = await client.query(sql, [`%${query}%`, parseInt(query, 10)]);
        } else {
            // It's text, split by spaces and search (AND logic)
            // Fix regex bug (double escaping \\s+)
            const terms = query.split(/\s+/).filter(t => t.length > 0);

            let sql = 'SELECT * FROM "Bricks" WHERE ';
            const conditions: string[] = [];
            const params: string[] = [];

            terms.forEach((term, index) => {
                conditions.push(`"Paver_Lines" ILIKE $${index + 1}`);
                params.push(`%${term}%`);
            });

            sql += conditions.join(' AND ');
            sql += ' AND "Lat" IS NOT NULL AND "Lon" IS NOT NULL';

            dbResult = await client.query(sql, params);
        }

        // Deduplicate on Name_Key
        const data = dbResult.rows;
        const uniqueDataMap = new Map();
        data.forEach(item => {
            uniqueDataMap.set(item.Name_Key, item);
        });

        const uniqueData = Array.from(uniqueDataMap.values());

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(uniqueData)
        };

    } catch (error: any) {
        console.error("Database query failed:", error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: `Database query failed: ${error.message || String(error)}` })
        };
    } finally {
        await client.end();
    }
};
