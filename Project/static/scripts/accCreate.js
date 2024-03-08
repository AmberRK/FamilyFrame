// accCreate.js
const bcrypt = require("bcrypt");
const saltRounds = 12;

const plainPass = "testpassworD1"; //THIS IS TEMP FOR TESTING, SHOULD BE USER INPUT

//Salting and hashing (and storage)
bcrypt
  .hash(plainPass, saltRounds)
  .then(hash => {
    console.log(`Hash: ${hash}`); //Displays the hash (REMOVE AFTER TESTING)
    // Store hash in your password DB here.
  })
  .catch(err => console.error(err.message));

  //issues with the database in Docker currently.