import config from './src/utils/config';

const pg = await import('pg');
const { Pool } = pg.default;

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');

    const result = await client.query('SELECT NOW()');
    console.log('⏰ Current time:', result.rows[0].now);

    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
