import dotenv from 'dotenv';
import { Pool, QueryResult } from 'pg';

class DbManager {
  private _pool: Pool;

  constructor() {
    dotenv.config();
    this._pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: 'localhost',
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    });
  }

  async open(): Promise<void> {
    await this._pool.connect();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async executeQuery<T>(query: string, params: any[]): Promise<QueryResult<T>> {
    return new Promise(async (resolve) => {
      const res = await this._pool.query(query, params);
      resolve(res);
    });
  }

  async close(): Promise<void> {
    await this._pool.end();
  }
}

export { DbManager };
