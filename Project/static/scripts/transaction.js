// import { Pool } from 'pg'
const { Pool } = require('pg');

const pool = new Pool({
  user: 'family',
  host: 'localhost',
  database: 'mydb',
  password: 'frame',
  port: 5432,
});

// const query = (text, params) => pool.query(text, params);
// module.exports = query;
const query = (text, params, callback) => {
  return pool.query(text, params, callback)
}
module.exports = { query };
