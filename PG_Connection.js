import pg from 'pg';
import dontev from 'dotenv';
dontev.config();

const pgPool = new pgPool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
});

export {pgPool};