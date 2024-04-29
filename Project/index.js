import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as d3 from "d3";
import * as db from './static/scripts/transaction.js'
import createTransport from 'nodemailer';
import path from 'path';
import url from 'url';
import request from 'request';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;
console.log("Port: " + port);

const secretKey = 'your_secret_key';

app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));
app.get('/mytrees', (req, res) => res.sendFile(__dirname + '/static/displayTrees.html'));

app.get('/grabmytrees', async (req, res) => {
  try {
    let decoded = jwt.verify(req.cookies.jwt, secretKey);
    let userid = [decoded.userid];
    // db.query('BEGIN')
    // select distinct t.treeid, t.userid, t2.createdby, t2.treelabel from familyframe.tbtreeauthor t, familyframe.tbtree t2 where userid = 1 and t.treeid = t2.treeid ;
  const result = await db.query("SELECT t.treeid, t.userid, t2.createdby, t2.treelabel FROM familyFrame.tbTreeAuthor t, familyframe.tbTree t2 WHERE userid = $1 and t.treeid = t2.treeid", userid);
  res.send(result.rows);
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
app.get('/grabALLtrees', async (req, res) => {
  try {
    let decoded = jwt.verify(req.cookies.jwt, secretKey);
    let userid = [decoded.userid];
    // select distinct t.treeid, t.userid, t2.createdby, t2.treelabel from familyframe.tbtreeauthor t, familyframe.tbtree t2 where userid = 1 and t.treeid = t2.treeid ;
    const result = await db.query('select t.treeid, t.userid, t2.createdby, t2.treelabel from familyFrame.tbTreeAuthor t, familyframe.tbtree t2 where t.treeid = t2.treeid');
    res.send(result.rows);
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/selectTree', async (req, res) => {
  try
  {
    res.cookie('treeid', req.body.treeID, { httpOnly: true, sameSite: true });
    console.log("Treeid: " + req.cookies.treeID);
    res.send("Success");
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/addTreeWithCode', async (req, res) => {
  try {
    let decoded = jwt.verify(req.cookies.jwt, secretKey);
    let userid = decoded.userid;
    let shareCode = req.body.shareCode;
    console.log(userid, shareCode);
    db.query('BEGIN');
    const insertText = 'INSERT INTO familyFrame.tbTreeAuthor(treeid, userid) VALUES ($1, $2)';
    const insertValues = [shareCode, userid];
    db.query(insertText, insertValues);
    db.query('COMMIT');
    res.send("Success");
  } catch (e) {
    db.query('ROLLBACK');
    throw e;
  }

});
// function getMyTrees() {
//   whoAmI()
//     .then(creds => { // Use then to wait for the whoAmI() function to complete
//       // console.log(creds);
//       // console.log(creds.userid);
//       fetch("/grabmytrees", {
//         method: "POST",
//         headers: {
//           "Content-type": "application/json; charset=UTF-8"
//         },
//         body: creds.userid
//       })
//         .then(response => response.json())
//         .then(json => console.log(json));
//     });
// }

app.get('/listOfPeople', async (req, res) => {
  try
  {
    var treeid = req.cookies.treeid;
    const result = await db.query("SELECT firstname FROM familyFrame.tbPerson where treeid = $1", [treeid]);
    res.send(result.rows);
  }
  catch (err) {
    console.error(err);
    res.send({});
  }
});

app.get('/results', async (req, res) => {
  try {
    // Add client releasing?
    const result = await db.query("SELECT personid, firstname, lastname, dateofbirth FROM familyFrame.tbPerson;")
    // const result = await db.query("SELECT * from familyFrame.;")
    res.send(result.rows)
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/results/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query("SELECT * FROM familyFrame.tbPerson WHERE personid = $1", [id])
  res.send(rows[0])
})

app.get('/stratifyChildren', async (req, res) => {
  const { id } = req.params
  // const { rows } = await db.query("select p2.firstname AS name, p1.firstname as parent FROM familyFrame.tbRelationship r JOIN familyFrame.tbPerson p1 ON r.person1ID = p1.personID JOIN familyFrame.tbPerson p2 ON r.person2ID = p2.personID JOIN familyFrame.tbRelationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid where p1.personID = 1 and r2.relationshiplabel = 'Parent';")
  const { rows } = await db.query("select p.firstname as name, null as parent from familyFrame.tbPerson p where p.personid not in (select distinct person2id from familyFrame.tbRelationship r where r.relationshiptypeid = 1) union select p2.firstname as name, p1.firstname as parent from familyFrame.tbRelationship r join familyFrame.tbPerson p1 on r.person1ID = p1.personID join familyFrame.tbPerson p2 on r.person2ID = p2.personID join familyFrame.tbRelationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid --where r2.relationshiplabel = 'Parent'; where p1.personID = 1 and r2.relationshiplabel = 'Parent' order by parent desc");
  // --where p1.personID = 1 and r2.relationshiplabel = 'Parent';
  res.send(rows)
})

app.get('/children/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query("SELECT p2.personid as id, p2.firstname AS childName FROM familyFrame.tbRelationship r JOIN familyFrame.tbPerson p1 ON r.person1ID = p1.personID JOIN familyFrame.tbPerson p2 ON r.person2ID = p2.personID JOIN familyFrame.tbRelationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid where p1.personID = $1 and r2.relationshiplabel = 'Parent';", [id])
  // const { rows } = await db.query("SELECT p2.firstname AS children FROM "family".relationship r JOIN "family".person p1 ON r.person1ID = p1.personID JOIN "family".person p2 ON r.person2ID = p2.personID JOIN "family".relationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid where p1.personID = 1 and r2.relationshiplabel = 'Parent';", [id])
  res.send(rows)
})

app.get('/users', async (req, res) => {
  try {
    // Add client releasing?
    const result = await db.query("SELECT * from familyFrame.tbUser");
    res.send(result.rows)
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/rel', async (req, res) => {
  try {
    // Add client releasing?
    const result = await db.query("SELECT p1.firstname AS person1_name, r2.relationshiplabel, p2.firstname AS person2_name FROM familyFrame.tbRelationship r JOIN familyFrame.tbPerson p1 ON r.person1ID = p1.personID JOIN familyFrame.tbPerson p2 ON r.person2ID = p2.personID JOIN familyFrame.tbRelationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid;")
    res.send(result.rows)
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/insertPerson', async (req, res) => {
  // const client = db.getClient()
  try {
    db.query('BEGIN');
    var treeID = req.cookies.treeid;
    let decoded = jwt.verify(req.cookies.jwt, secretKey);
    let userid = decoded.userid;
    const insertText = 'INSERT INTO familyFrame.tbPerson(firstName, lastName, dateOfBirth, gender, createdBy, treeID) VALUES ($1, $2, $3, $4, $5, $6)';
    // const insertValues = ['Mona', 'Simpson', '1901-01-12', 'Female', 1, 1];
    const insertValues = [req.body.firstName, req.body.lastName, req.body.dob, req.body.gender, userid, treeID];
    await db.query(insertText, insertValues);
    db.query('COMMIT');
    var newPersonID = await db.query("SELECT personID FROM familyFrame.tbPerson WHERE firstName = $1", [req.body.firstName]);
    var parentID = await db.query("SELECT personID FROM familyFrame.tbPerson WHERE firstName = $1", [req.body.parent]);
    var parentLabel = await db.query("SELECT relationshiptypeid FROM familyFrame.tbRelationshiptype WHERE relationshipLabel = 'Parent'");
    newPersonID = newPersonID.rows[0].personid;
    parentID = parentID.rows[0].personid;
    parentLabel = parentLabel.rows[0].relationshiptypeid;
    console.log("New Person ID: " + newPersonID);
    db.query('BEGIN');
    const insertText2 = 'INSERT INTO familyFrame.tbRelationship(person1ID, person2ID, relationshipTypeID) VALUES ($1, $2, $3)';
    const insertValues2 = [parentID, newPersonID, parentLabel];
    db.query(insertText2, insertValues2);
    db.query('COMMIT');
  } catch (e) {
    db.query('ROLLBACK');
    throw e;
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
app.get('/ui', (req, res) => res.sendFile(__dirname + '/static/uiDesign.html'));
app.get('/forgotpass', (req, res) => res.sendFile(__dirname + '/static/forgotpass.html'));
app.get('/newpass', (req, res) => res.sendFile(__dirname + '/static/newpass.html'));

app.post('/existingUser', async (req, res) => {
  try {
    db.query('BEGIN')
    const queryText = 'SELECT userid, displayname FROM familyFrame.tbUser WHERE email = $1 and passwordHash = crypt($2, passwordHash)';
    const passedValues = [req.body.email, req.body.password];
    const result = await db.query(queryText, passedValues);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      // const fakeUser = { id: 1, username: 'example_user' };
      const accessToken = jwt.sign(user, secretKey, { expiresIn: '1d' });
      // res.json({ accessToken });
      res.cookie('jwt', accessToken, { httpOnly: true, sameSite: true });
      console.log("Cookie: " + req.cookies.jwt);
      res.status(200).json({ message: "Account authenticated", user, accessToken });

    } else {
      console.log("Authentication failed");
      res.status(401).json({ message: "Authentication failed" });
    }
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Use this function to authenticate token, use authentication for navbar
// Make new path for navbar, use this function to authenticate token
function authenticateToken(req, res, next) {
  // Extract JWT from the Authorization header
  const authHeader = req.cookies.jwt;
  // console.log("auth: " + authHeader + " split: " + authHeader.split(' ')[1]);
  console.log("auth: " + authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  // if (!token) {
  //   return res.sendStatus(401); // Unauthorized
  // }

  // Verify JWT signature
  jwt.verify(req.cookies.jwt, secretKey, (err, user) => {
    if (err) {
      console.log("Error: " + err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach user information to the request object
    next();
  });
}

app.get('/getCredentials', (req, res) => {

  let decoded = jwt.verify(req.cookies.jwt, secretKey);
  // console.log(decoded);
  res.json(decoded);
});

// Route for user login (generating JWT)
app.post('/loginJWT', (req, res) => {

  const fakeUser = { id: 1, username: 'example_user' };

  // Generate JWT with user information
  const accessToken = jwt.sign(fakeUser, secretKey, { expiresIn: '15m' });

  res.json({ accessToken });

});

// Protected route (accessible only to authenticated users)
app.get('/profileJWT', authenticateToken, (req, res) => {
  // Access user information from the request object
  res.json(req.user);
});

app.post('/createUser', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  try {
    // Move regex over here
    // Check if email is already in use
    await db.query('BEGIN')
    const queryText = 'SELECT userid, displayname FROM familyFrame.tbUser WHERE email = $1';
    const passedValues = [req.body.email];
    console.log("Email: " + req.body.email);
    const result = await db.query(queryText, passedValues);
    if (result.rows.length > 0) {
      await db.query('COMMIT');
      res.status(400).json({ message: "Email already in use" });
      return;
    }
    await db.query('COMMIT');

    // If email is not in use, create the account
    db.query('BEGIN')
    const insertText = 'INSERT INTO familyFrame.tbUser(displayName, email, passwordHash) VALUES ($1, $2, crypt($3, gen_salt(\'bf\')))';
    const insertValues = [req.body.displayName, req.body.email, req.body.password];

    db.query(insertText, insertValues)
      .then(() => {
        res.status(200).json({ message: "Account created successfully", email: req.body.email });
        return db.query('COMMIT');
      });
  }

  catch (error) {
    await db.query('ROLLBACK');
    // If an error occurs, send an error response
    console.error('Error hashing password:', error);
    res.status(400).json({ err: error });
  }
});

app.post('/verifyEmail', bodyParser.urlencoded({ extended: false }), (req, res) => {
  // Make an object to send to MailChimp
  const mailChimpEmail = {
    members: [
      {
        email_address: req.body.email,
        status: 'pending'
      }
    ]
  }
  // Convert object to JSON
  const jsonData = JSON.stringify(mailChimpEmail);
  // Set up options for the request
  const options = {
    // us-18 : authorization extenstion, seen at the end of our authorization key (example will show us-XX), 
    // 7104ba39dead2e1035ff87427b07465f-us18 : authorzation key 
    // ee85e33acb : Audience id
    // api.mailchimp.com/3.0/lists: mailchimp API

    url: 'https://us18.api.mailchimp.com/3.0/lists/ee85e33acb',
    method: 'POST',
    headers: {
      Authorization: 'auth 7104ba39dead2e1035ff87427b07465f-us18',
    },
    body: jsonData
  }
  // Send the request to MailChimp
  console.log("Email: " + req.body.email);
  request(options, (error, response, body) => {
    if (error) {
      res.sendStatus(500); // error :(
    } else {
      res.sendStatus(200); //successful :)
    }
  })
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


//Logout Cookie clearing
app.post('/loggedout', async (req, res) => {
try {
    // doesn't work res.cookie('compacookie', 'testcookie2', { httpOnly: true, sameSite: true, expires: new Date(Date.now() + 900000) });
   // doesn't work res.cookie('testcook', 'testcookie', { httpOnly: true, sameSite: true, expires: new Date(Date.now() + 1) }); //test cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: true, path: "/" }); //this was the ONLY thing that worked
    res.clearCookie('treeid', { httpOnly: true, sameSite: true, path: "/" }).send('cleared cookie');
    //console.log("Cookie: " + req.cookies.jwt);
  }
catch (error) {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal Server Error' });
}
});

app.post('/ownerVerify', async (req, res) => {
  try {
    db.query('BEGIN')
    const queryText = 'SELECT passwordHash FROM familyFrame.tbUser WHERE email = $1';
    const passedValues = [req.body.email];
    const result = await db.query(queryText, passedValues);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      res.status(200).json({ message: "Email authenticated"});

    } else {
      console.log("Authentication failed");
      res.status(401).json({ message: "Authentication failed" });
    }
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/ownerChange', async (req, res) => {
  try {
    db.query('BEGIN')
    const queryText = 'SELECT userid, displayname FROM familyFrame.tbUser WHERE passwordHash = crypt($1, passwordHash)';
    const passedValues = [req.body.password];
    const result = await db.query(queryText, passedValues);
    console.log(result);
    if (result.rows.length === 1) {
      const user = result.rows[0];
      res.status(200).json({ message: "Email authenticated"});

    } else {
      console.log("Authentication failed");
      res.status(401).json({ message: "Authentication failed" });
    }
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
