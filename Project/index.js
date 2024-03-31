import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import * as d3 from "d3";
import * as db from './static/scripts/transaction.js'

import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const express = require('express');
// const db = require('./static/scripts/transaction.js');
// const bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;
console.log("Port: " + port);

// import * as d3 from "d3";
// const d3 = require('d3');

app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));
app.get('/mytrees', (req, res) => res.sendFile(__dirname + '/static/displayTrees.html'));

app.get('/results', async (req, res) => {
  try {
    // Add client releasing?
    const result = await db.query("SELECT personid, firstname, lastname, dateofbirth FROM person;")
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

app.get('/stratifyChildren', async (req, res) => {
  const { id } = req.params
  // const { rows } = await db.query("select p2.firstname AS name, p1.firstname as parent FROM family.relationship r JOIN family.person p1 ON r.person1ID = p1.personID JOIN family.person p2 ON r.person2ID = p2.personID JOIN family.relationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid where p1.personID = 1 and r2.relationshiplabel = 'Parent';")
  const { rows } = await db.query("select p.firstname as name, null as parent from family.person p where p.personid not in (select distinct person2id from family.relationship r where r.relationshiptypeid = 1) union select p2.firstname as name, p1.firstname as parent from family.relationship r join family.person p1 on r.person1ID = p1.personID join family.person p2 on r.person2ID = p2.personID join family.relationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid --where r2.relationshiplabel = 'Parent'; where p1.personID = 1 and r2.relationshiplabel = 'Parent' order by parent desc");
  // --where p1.personID = 1 and r2.relationshiplabel = 'Parent';
  res.send(rows)
})

app.get('/children/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query("SELECT p2.personid as id, p2.firstname AS childName FROM family.relationship r JOIN family.person p1 ON r.person1ID = p1.personID JOIN family.person p2 ON r.person2ID = p2.personID JOIN family.relationshiptype r2 on r.relationshiptypeid = r2.relationshiptypeid where p1.personID = $1 and r2.relationshiplabel = 'Parent';", [id])
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
app.get('/ui', (req, res) => res.sendFile(__dirname + '/static/uiDesign.html'));

// Get stuff from login
app.post('/login', (req, res) => {
  const receivedData = req.body;
  try {
    if (receivedData.loggedIn) {
      console.log("You are logged in!");
      // Set cookie, set secure = true for https when we have it
      res.cookie('emails', receivedData.email, httpOnly = true, maxAge = 1000 * 60 * 60 * 24 * 7);

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

app.post('/createUser', async (req, res) => {
  // let saltRounds = 10;
  // try {
  //   console.log(req.body.password);
  //   // bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
  //   //   // res.status(200).json({ pword: hash });
  //   //   console.log(hash);
  //   // })
  // }
  //  catch (e) {
  //     throw (e);
  //   }
  // });
  try {
    // Extract the password from the request body
    const { password } = req.body;

    // Number of salt rounds
    const saltRounds = 10;

    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // At this point, hashedPassword contains the hashed password
    console.log('Hashed Password:', hashedPassword);

    // You might want to store hashedPassword in your database here

    // Send a response indicating success
    res.status(200).json({ success: true, message: 'Password hashed successfully' });
  }
  catch (error) {
    // If an error occurs, send an error response
    console.error('Error hashing password:', error);
    res.status(500).json({ success: false, error: 'Error hashing password' });
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
