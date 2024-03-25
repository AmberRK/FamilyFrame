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
app.get('/mytrees', (req, res) => res.sendFile(__dirname + '/static/trees.html'));

app.get('/results', async (req, res) => {
  try {
    // Add client releasing?
    const result = await db.query("SELECT * FROM person;")
    res.send(result.rows)
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/results/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query("SELECT * FROM person WHERE personid = $1", [id])
  res.send(rows[0])
})

app.get('/children/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query("SELECT p2.firstname AS childName FROM family.relationship r JOIN family.person p1 ON r.person1ID = p1.personID JOIN family.person p2 ON r.person2ID = p2.personID JOIN family.relationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid where p1.personID = $1 and r2.relationshiplabel = 'Parent';", [id])
  // const { rows } = await db.query("SELECT p2.firstname AS children FROM "family".relationship r JOIN "family".person p1 ON r.person1ID = p1.personID JOIN "family".person p2 ON r.person2ID = p2.personID JOIN "family".relationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid where p1.personID = 1 and r2.relationshiplabel = 'Parent';", [id])
  res.send(rows)
})

app.get('/rel', async (req, res) => {
  try {
    // Add client releasing?
    const result = await db.query("SELECT p1.firstname AS person1_name, r2.relationshiplabel, p2.firstname AS person2_name FROM family.relationship r JOIN family.person p1 ON r.person1ID = p1.personID JOIN family.person p2 ON r.person2ID = p2.personID JOIN family.relationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid;")
    res.send(result.rows)
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/insertPerson', (req, res) => {
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
