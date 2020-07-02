--
-- SQLite
-- Create the tables
--

DROP TABLE IF EXISTS starter_users;

CREATE TABLE IF NOT EXISTS starter_users (
  user_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  roles NOT NULL
);
