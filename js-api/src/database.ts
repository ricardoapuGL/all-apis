import { Pool, QueryResult } from 'pg'


const pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host:  process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'postgres',
    password: process.env.PGPASSWORD ||  '1234',
    port: parseInt(process.env.PGPORT || '5432'),
  })

  export default {
    async query(text: string, params: unknown[]): Promise<QueryResult<any>> {
      const start = Date.now()
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      return res
    },
    async end() : Promise<void> {
      await pool.end()
    }    
  }