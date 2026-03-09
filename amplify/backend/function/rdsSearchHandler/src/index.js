/*
Use the following code to retrieve configured secrets from SSM:

const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');

const client = new SSMClient();
const { Parameters } = await client.send(new GetParametersCommand({
  Names: ["n"].map(secretName => process.env[secretName]),
  WithDecryption: true,
}));

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	RDS_HOST
	RDS_PORT
	RDS_USER
	RDS_PASSWORD
	RDS_DB
Amplify Params - DO NOT EDIT */

const { Pool } = require('pg');

exports.handler = async (event) => {
  const pool = new Pool({
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB,
    ssl: { rejectUnauthorized: false } // RDS requires SSL
  });

  try {
    const client = await pool.connect();
    const query = event.arguments?.query || ''; // From GraphQL input
    const result = await client.query(
      `SELECT * FROM "Bricks" WHERE "Paver_Lines" ILIKE $1 LIMIT 20`,
      [`%${query}%`]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw new Error('Database query failed');
  } finally {
    pool.end();
  }
};