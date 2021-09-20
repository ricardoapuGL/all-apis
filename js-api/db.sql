
CREATE TABLE IF NOT EXISTS todo (
    todo_id     SERIAL PRIMARY KEY,
    user_id     TEXT NULL,
    text        TEXT NOT NULL,
    done        boolean
);