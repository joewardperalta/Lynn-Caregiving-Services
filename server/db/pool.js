const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set. Form submissions will fail until PostgreSQL is configured.");
}

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000
});

pool.on("error", function (error) {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

module.exports = pool;
