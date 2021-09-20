import { Pool } from 'pg'


const pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host:  process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'postgres',
    password: process.env.PGPASSWORD ||  '1234',
    port: parseInt(process.env.PGPORT || '5432'),
  })

export default pool