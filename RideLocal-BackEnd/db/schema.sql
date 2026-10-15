DROP TABLE IF EXISTS ride_members;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  zip_code text NOT NULL,
  bio text,
  profile_pic text
);

CREATE TABLE rides (
  id serial PRIMARY KEY,
  creator_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  zip_code text NOT NULL,
  meeting_spot text NOT NULL,
  ride_date timestamptz NOT NULL,
  difficulty text NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  max_riders integer CHECK (max_riders > 0)
);

CREATE TABLE ride_members (
  ride_id integer NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (ride_id, user_id)
);
