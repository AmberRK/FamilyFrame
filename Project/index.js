const express = require('express');
const db = require('./static/scripts/transaction.js');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;
console.log("Port: " + port);


app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
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

app.get('/results/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM person WHERE personid = $1', [id])
  res.send(rows[0])
})

app.post('/insertData', (req, res) => {
  // const client = db.getClient()

  try {
    db.query('BEGIN')

    const insertText = 'INSERT INTO person(firstName, lastName, dateOfBirth, gender, createdBy, treeID) VALUES ($1, $2, $3, $4, $5, $6)';
    // const insertValues = ['Mona', 'Simpson', '1901-01-12', 'Female', 1, 1];
    const insertValues = [req.body.firstName, req.body.lastName, req.body.dob, req.body.gender, req.body.createdBy, req.body.treeID];
    db.query(insertText, insertValues)
    db.query('COMMIT')
  } catch (e) {
    db.query('ROLLBACK')
    throw e
  }
  // finally {
  //   client.release()
  // }
});

app.get('/home', (req, res) => res.sendFile(__dirname + '/static/homepage.html'));
app.get('/about', (req, res) => res.sendFile(__dirname + '/static/aboutPage.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/static/login.html'));
app.get('/newuser', (req, res) => res.sendFile(__dirname + '/static/newuser.html'));
app.get('/index', (req, res) => res.sendFile(__dirname + '/static/index.html'));

// Get stuff from login
app.post('/login', (req, res) => {
  const receivedData = req.body;
  try {
    if (receivedData.loggedIn) {
      console.log("You are logged in!");
      // Set cookie
      res.cookie('emails', receivedData.email);

      // Get cookie
      const cookieValue = req.cookies.emails;
      const dataToSend =
      {
        message: cookieValue
      };

      if (receivedData.email === "email") {
        dataToSend.message = cookieValue;
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

app.post('/index', (req, res) => {
  // Get cookie
  const cookieValue = req.cookies.emails;
  const dataToSend =
  {
    message: cookieValue
  };
  res.json(dataToSend);

});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
