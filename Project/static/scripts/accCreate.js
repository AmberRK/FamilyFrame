
async function createAcct() {
  document.getElementById('accCreate').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    let emailRegex = RegExp("^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    let emailToCheck = jsonData.email;
    if (emailRegex.test(emailToCheck)) {
      window.alert("Email passed regex");
      fetch("/createUser", {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })

        .then((response) => {
          if (response.ok) {
            alert("Success!")
          } else {
            alert("Error!")
          }
          response.json()
        })
        .then((json) => console.log(json));
    }
    else {
      window.alert("Email failed regex");
    };
  });
};