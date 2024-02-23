const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'family',
  host: 'localhost',
  database: 'mydb',
  password: 'frame',
  port: 5432,
});

app.use(express.static(__dirname + '/static'));

app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));

// Example query
app.get('/results', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM person');
    const results = { 'results': (result) ? result.rows : null };
    res.send(results);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/home', (req, res) => res.sendFile(__dirname + '/static/home.html'));
app.get('/homepage', (req, res) => res.sendFile(__dirname + '/static/homepage.html'));
app.get('/aboutUs', (req, res) => res.sendFile(__dirname + '/static/aboutPage.html'));

app.get('/login', (req, res) => res.sendFile(__dirname + '/static/login.html'));

app.post('/api/endpoint', (req, res) => {
  const receivedData = req.body;

  if(receivedData.loggedIn) {
    console.log("You are logged in!");
  }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });