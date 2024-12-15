import express from 'express';
import pg from 'pg';
import dontev from 'dotenv';

dontev.config();


const app = express();
app.use(express.json());

const { Client } = pg;

// Starting the server on port 3001 and logging a message when it's running.
app.listen(3001, () => {
    console.log('Server is running..');
});

// Creating a new client instance for connecting to the PostgreSQL database with configuration options.
const client = new Client({
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
});

// Calling the connect function to establish a connection to the database.
connect();

// Defining the connect function that connects to the PostgreSQL database.
async function connect() {
    try {
        await client.connect();
        console.log('You are connected to the database..')
    } catch (error) {
        console.log(error.message);
    }
}

// Defining a simple route for the root ("/") URL that sends a message to the client.
app.get('/', (req,res) => {
    res.send('You are at the frontpage of this server!');
});
