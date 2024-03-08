const express = require('express');
const db = require('./static/scripts/transaction.js');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
console.log("Port: " + port);


app.use(express.static(__dirname + '/static'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));

// Example query
app.get('/results', async (req, res) => {
  try {
    // ADD parameterizing and client releasing
    // const result = await db.query('SELECT * FROM person WHERE id = $1', [req.params.id])
    const result = await db.query("SELECT * FROM person;")
    // const result = await db.query("SELECT * FROM person WHERE personid > 3;")
    res.send(result.rows)
    // res.send(result)
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/home', (req, res) => res.sendFile(__dirname + '/static/homepage.html'));
app.get('/about', (req, res) => res.sendFile(__dirname + '/static/aboutPage.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/static/login.html'));
app.get('/newuser', (req, res) => res.sendFile(__dirname + '/static/newuser.html'));

// Get stuff from login
app.post('/api/endpoint', (req, res) => {
  const receivedData = req.body;
  try {
    if (receivedData.loggedIn) {
      console.log("You are logged in!");
      // Response to client
      const dataToSend =
      {
        message: 'Login completed!'
      };

      if (receivedData.email === "email") {
        dataToSend.message = "Email is correct!";
      }
      // Send to client
      res.json(dataToSend);

    }
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
