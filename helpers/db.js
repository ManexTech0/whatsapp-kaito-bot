const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'data.sqlite'));

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    yaps INTEGER,
    last_updated INTEGER
  )
`).run();

function updateUserYaps(username, yaps) {
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO users (username, yaps, last_updated)
    VALUES (?, ?, ?)
    ON CONFLICT(username)
    DO UPDATE SET yaps = excluded.yaps, last_updated = excluded.last_updated
  `);
  stmt.run(username, yaps, now);
}

function getUser(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

module.exports = { updateUserYaps, getUser };
