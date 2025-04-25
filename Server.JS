const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('.'));
app.use(bodyParser.json());

const db = new sqlite3.Database('lab.db');

db.run(`CREATE TABLE IF NOT EXISTS drugs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  incubator TEXT,
  duration INTEGER,
  start_date TEXT
)`);

app.post('/add', (req, res) => {
  const { name, incubator, duration } = req.body;
  const start_date = new Date().toISOString();
  db.run(`INSERT INTO drugs (name, incubator, duration, start_date) VALUES (?, ?, ?, ?)`,
    [name, incubator, parseInt(duration), start_date], (err) => {
      if (err) return res.status(500).send(err);
      res.send({ status: 'success' });
    });
});

app.get('/drugs', (req, res) => {
  db.all(`SELECT * FROM drugs`, (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
