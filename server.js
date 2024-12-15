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

// 1. Adding new movie genres
app.post('/genres', async (req, res) => {
    const { movie_genre } = req.body;
    try {
        const result = await client.query('INSERT INTO genres (movie_genre) VALUES ($1) RETURNING *', [movie_genre]);
        res.status(201).json({ 
            message: 'Genre added successfully!',
            genre: result.rows[0] 
        });
    } catch (error) {
        console.error('Error in adding new genres', error.message);
    }
});

// 2. Adding new movies
app.post('/movies', async (req, res) => {
    const { movie_name, movie_year, genre_id } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO movies (movie_name, movie_year, genre_id) VALUES ($1, $2, $3) RETURNING *', 
            [movie_name, movie_year, genre_id]
        );
        res.status(201).json({ 
            message: 'Movie added successfully!',
            movie: result.rows[0] 
        });
    } catch (error) {
        console.error('Error in adding new movie:', error.message);
    }
});

// 3. Registering a new user
app.post('/users', async (req, res) => {
    const { name, username, password, birthYear } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO users (name, username, password, birthYear) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, username, password, birthYear]
        );
        res.status(201).json({ 
            message: 'User registered successfully!',
            user: result.rows[0] 
        });
    } catch (error) {
        console.error('Error in adding new user:', error.message);
    }
});

// 4. Getting movies by id
app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('SELECT * FROM movies WHERE movie_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ 
            message: 'Movie fetched successfully!',
            movie: result.rows[0] 
        });
    } catch (error) {
        console.error('Error in getting movies by id:', error.message);
    }
});

// 5. Removing movies by id
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM movies WHERE movie_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ 
            message: 'Movie deleted successfully!',
            deletedMovie: result.rows[0] 
        });
    } catch (error) {
        console.error('Error in removing movies by id:', error.message);
    }
});

// 6. Getting all movies
app.get('/movies', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM movies');
        res.json({ 
            message: 'Movies fetched successfully!',
            movies: result.rows 
        });
    } catch (error) {
        console.error('Error in getting all movies:', error.message);
    }
});

// 7. Getting movies by keyword
app.get('/movies/search', async (req, res) => {
    const { keyword } = req.query;
    try {
        const result = await client.query(
            'SELECT * FROM movies WHERE movie_name ILIKE $1', 
            [`%${keyword}%`]
        );
        res.json({ 
            message: 'Movies fetched successfully!',
            movies: result.rows 
        });
    } catch (error) {
        console.error('Error in getting movies by keyword:', error.message);
    }
});

// 8. Adding movie review
app.post('/reviews', async (req, res) => {
    const { user_id, movie_id, stars, review_text } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO reviews (user_id, movie_id, stars, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, movie_id, stars, review_text]
        );
        res.status(201).json({ 
            message: 'Review added successfully!',
            review: result.rows[0] 
        });
    } catch (error) {
        console.error('Error in adding new review', error.message);
    }
});

// 9. Adding favorite movies for users
app.post('/favorites', async (req, res) => {
    const { user_id, movie_id } = req.body;

    try {
        // Check if the movie and user exist
        const movieResult = await client.query('SELECT * FROM movies WHERE movie_id = $1', [movie_id]);
        const userResult = await client.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

        if (movieResult.rows.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the movie to the user's favorites
        const result = await client.query(
            'INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *', 
            [user_id, movie_id]
        );

        res.status(201).json({
            message: 'Movie added to favorites successfully!',
            favorite: result.rows[0]
        });
    } catch (error) {
        console.error('Error in adding favorite movies for users:', error.message);
    }
});

// 10. Getting favorite movies by username
app.get('/favorites/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Get user by username
        const userResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user_id = userResult.rows[0].user_id;

        // Get the favorite movies of the user
        const favoritesResult = await client.query(
            'SELECT m.movie_id, m.movie_name, m.movie_year, g.movie_genre ' +
            'FROM favorites f ' +
            'JOIN movies m ON f.movie_id = m.movie_id ' +
            'JOIN genres g ON m.genre_id = g.genre_id ' +
            'WHERE f.user_id = $1',
            [user_id]
        );

        if (favoritesResult.rows.length === 0) {
            return res.status(404).json({ message: 'No favorite movies found for this user' });
        }

        res.json({
            message: 'Favorite movies fetched successfully!',
            favorites: favoritesResult.rows
        });
    } catch (error) {
        console.error('Error in getting favorite movies by username:', error.message);
    }
});