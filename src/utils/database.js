import pkg from 'pg';
import config from './config.js';
const { Pool } = pkg;

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
});

export default pool;
