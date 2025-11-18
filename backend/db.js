const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'nexus',
  password: process.env.DB_PASS || 'nexus',
  database: process.env.DB_NAME || 'nexuslearn'
})

async function query(text, params) {
  const res = await pool.query(text, params)
  return res.rows
}

module.exports = { query }