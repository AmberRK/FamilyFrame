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
    const result = await db.query("SELECT personid, firstname, lastname, dateofbirth FROM familyFrame.tbPerson;")
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

app.post('/insertPerson', (req, res) => {
  // const client = db.getClient()
  try {
    db.query('BEGIN');
    const insertText = 'INSERT INTO familyFrame.tbPerson(firstName, lastName, dateOfBirth, gender, createdBy, treeID) VALUES ($1, $2, $3, $4, $5, $6)';
    // const insertValues = ['Mona', 'Simpson', '1901-01-12', 'Female', 1, 1];
    const insertValues = [req.body.firstName, req.body.lastName, req.body.dob, req.body.gender, req.body.createdBy, req.body.treeID];
    db.query(insertText, insertValues);
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
  let saltRounds = 10;
  try {
    // const insertText = 'INSERT INTO familyFrame.tbUser(displayName, email, passwordHash) VALUES ($1, $2, $3)';
    db.query('BEGIN')
    const insertText = 'INSERT INTO familyFrame.tbUser(displayName, email, passwordHash) VALUES ($1, $2, crypt($3, gen_salt(\'bf\')))';
    const insertValues = [req.body.displayName, req.body.email, req.body.password];
    db.query(insertText, insertValues)
      .then(() => {
        console.log("Insert successful");
        res.status(200).json({ message: "Account created successfully" });
        return db.query('COMMIT');
      })
      .catch(error => {
        console.error("Error:", error);
        res.status(400).json({ err: error });
        db.query('ROLLBACK'); // Rollback the transaction in case of error
      });
  }

  // bcrypt.hash("password", saltRounds).then(function (hash) {
  //   // res.status(200).json({ pword: hash });
  //   console.log(hash);
  // })
  catch (error) {
    db.query('ROLLBACK')
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
