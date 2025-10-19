import fs from "fs";

const DB_PATH = "./data.json";

// load existing data
function readData() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { users: {} };
  }
}

// save updated data
function writeData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// get user info
export function getUser(username) {
  const db = readData();
  return db.users[username] || { yaps: 0, innerCT: false };
}

// update user info
export function updateUser(username, update) {
  const db = readData();
  db.users[username] = { ...getUser(username), ...update };
  writeData(db);
}

// increment yaps
export function addYap(username) {
  const user = getUser(username);
  updateUser(username, { yaps: user.yaps + 1 });
}
