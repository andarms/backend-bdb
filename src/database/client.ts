import dotenv from 'dotenv';
import { Client } from 'pg';

async function connect(): Promise<void> {
  dotenv.config();
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  const res = await client.query('SELECT * from Persons');
  console.log(res.rows[0]);
  await client.end();
}

export { connect };
