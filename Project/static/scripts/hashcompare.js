// hashcompare.js
//this file works in testing but still needs to be modified to 1.take in form info and 2. take in SQL database info
const bcrypt = require("bcrypt");

const plainPass = "testpassworD1";
const hash = "$2b$12$F5qeQZmAfGVSTQs58TZMkuObzvWkv83LmDvdkhp0z4LE3I96IVGZe"; //This was a hash made from accCreate.js, should be pulled from a database in reality
bcrypt
  .compare(plainPass, hash)
  .then(res => {
    console.log(res);
  })
  .catch(err => console.error(err.message));