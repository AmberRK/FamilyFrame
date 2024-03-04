const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
console.log("Port: " + port);

const pool = new Pool({
  user: 'family',
  host: 'localhost',
  database: 'mydb',
  password: 'frame',
  port: 5432,
});

app.use(express.static(__dirname + '/static'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));

// Example query
app.get('/results', async (req, res) => {
  try 
  {
    const client = await pool.connect();
    const result1 = await client.query('SELECT * FROM person');
    const result2 = await client.query('SELECT * FROM relationship');
    const results1 = { 'results': (result1) ? result1.rows : null };
    const results2 = { 'results': (result2) ? result2.rows : null };
    res.send(results1);
    // res.send(results2);
    client.release();
  } 
  catch (err) 
  {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/home', (req, res) => res.sendFile(__dirname + '/static/homepage.html'));
app.get('/about', (req, res) => res.sendFile(__dirname + '/static/aboutPage.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/static/login.html'));

// Get stuff from login
app.post('/api/endpoint', (req, res) => {
  const receivedData = req.body;
  try
  {
    if(receivedData.loggedIn) 
    {
      console.log("You are logged in!");
      // Response to client
      const dataToSend = 
      {
        message: 'Login completed!'
      };
      
      if(receivedData.email === "email")
      {
        dataToSend.message = "Email is correct!";
      }
      // Send to client
      res.json(dataToSend);
      
    }
  }
  catch (error) 
  {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });