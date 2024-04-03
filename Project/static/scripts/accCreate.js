
async function createAcct() {
  document.getElementById('accCreate').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    // Email regex
    // '^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'
    fetch("/createUser", {
      method: "POST",
      body: JSON.stringify(jsonData),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    fetch("/emailVerification", {
      method: "POST",
      body: JSON.stringify({verificationCode: verificationCode, email: jsonData.email}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    // bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
    // Store hash in your password DB.
    // console.log(hash);
    // });
    // const saltRounds = 12;
    // const plainPass = "testpassworD1"; //THIS IS TEMP FOR TESTING, SHOULD BE USER INPUT
    // hash(password, saltRounds)
    //   .then(hash => {
    //     console.log(`Hash: ${hash}`); //Displays the hash (REMOVE AFTER TESTING)
    //     // Store hash in your password DB here.
    //   })
    //   .catch(err => console.error(err.message));
  });
};