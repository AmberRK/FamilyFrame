const bcrypt = require("bcrypt")
const readline = require("readline") // for CLI testing

const saltRounds = 12; // Salt rounds to be done

//CLI Testing
const rl =
	readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	
let userInput =  "";

rl.question("Password to hash\n", function (string) {
	 plainPassword = string;

rl.close();
});



// Hashing and Salting Process
bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
  // Store hash in database here
  console.log(hash);
});