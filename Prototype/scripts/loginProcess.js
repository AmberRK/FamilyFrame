const bcrypt = require("bcrypt")
const readline = require("readline") // for CLI testing

//CLI Testing
const rl =
	readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	
let userInput =  "";

rl.question("Password to check\n", function (string) {
	 plainPassword = string;


rl.close();
});


// Comparison Process
bcrypt.compare(plainPassword, hash, function(err, result) {
    if (result) {
        // password is valid
		console.log("Details match.")
    }
	else {
		console.log("Unable to match details.");
	}
});