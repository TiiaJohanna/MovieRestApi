CREATE TABLE movies(
    movie_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_name VARCHAR(255),
    movie_year INT,
    genre_id INT,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
)

CREATE TABLE genres(
    genre_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_genre VARCHAR(255) NOT NULL UNIQUE
)

CREATE TABLE users(
    user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    birthYear INT,
    UNIQUE (username)
)

CREATE TABLE favorites(
    favorite_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    movie_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
)

CREATE TABLE reviews(
    review_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    movie_id INT,
    stars INT CHECK (stars BETWEEN 1 AND 5),
    review_text TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
)

INSERT INTO genres (movie_genre) VALUES 
('drama'),
('comedy'),
('scifi'),
('fantasy'),
('action'),
('thriller');

INSERT INTO movies (movie_name, movie_year, genre_id) VALUES
('Inception', 2010, 5),
('The Terminator', 1984, 5),
('Tropic Thunder', 2008, 2),
('Borat', 2006, 2),
('Interstellar', 2014, 1),
('Joker', 2019, 1);

INSERT INTO users (name, username, password, birthyear) VALUES
('Reima Riihimäki', 'reimarii', 'qwerty123', 1986),
('Lisa Simpson', 'lizzy', 'abcdef', 1991),
('Ben Bossy', 'boss', 'salasana', 1981),
('Tiia Tiihonen', 'tiiajohanna', 'kissa21', 1999);

INSERT INTO favorites (user_id, movie_id) VALUES
(4, 4),
(3, 1),
(2, 3),
(1, 2);

INSERT INTO reviews (user_id, movie_id, stars, review_text) VALUES
(4, 4, 4, 'Too oldfashioned and cringe-worthy.'),
(3, 1, 3, 'This movie makes you question the boundaries of reality.'),
(2, 3, 2, 'War movies are not my thing.'),
(1, 2, 5, 'An Iconic classic that made Arnold a legend!');