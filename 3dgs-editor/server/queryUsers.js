// queryUsers.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log("所有用户：");
    rows.forEach((row) => {
      console.log(row);
    });
  });
});

db.close();
