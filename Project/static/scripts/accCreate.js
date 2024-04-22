function alertUser(type, notice, message) 
{
  var alert = document.getElementById("alert");
  alert.className = type;
  message = '<span class="closebtn">&times;</span>'
  + ' <strong>' + notice + ' </strong>' + message;
  alert.setAttribute("style", "opacity: 1");
  alert.innerHTML = message;

  var close = document.getElementsByClassName("closebtn");
  var i;

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function()
    {
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
    }
}
}

function createAcct(event) {
  try
  {
    var accountMade = false;
    //document.getElementById('accCreate').addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });
      let emailRegex = RegExp("^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
      let emailToCheck = jsonData.email;

      // console.log("email: " + emailToCheck);
      if (emailRegex.test(emailToCheck)) 
      {
        // window.alert("Email passed regex");
        fetch("/createUser", 
        {
            method: "POST",
            body: JSON.stringify(jsonData),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => 
        {
          if (response.ok) {
            console.log("Account created");
            accountMade = true;
          } else {
            alertUser("alert", "Error!", "Email already in use");
            accountMade = false;
          }
          console.log("accountMade: " + accountMade);
          if(accountMade)
          {
            fetch("/verifyEmail", 
            {
              method: "POST",
              body: JSON.stringify({email: emailToCheck}),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then((response) => 
            {
              if (response.ok) {
                alertUser("alert-success", "Success!", "Please check your inbox to verify");
              } else {
                alertUser("alert", "Error!", "Unable to send verification email.");
              }
              response.json()
            })
            .catch((error) => {
              alertUser("alert", "Error!", "An unexpected error occurred");
            });
        }
        })
        .catch((error) => {
          alertUser("alert", "Error!", "An unexpected error occurred");
          accountMade = false;
        });
      }
      else
      {
        alertUser("alert", "Error!", "Invalid email");
      }
    // });    
  }
  catch(error)
  {
    console.error('Error:', error);
    // alertUser("alert", "Error!", "An unexpected error occurred");
  }
}

document.getElementById('accCreate').addEventListener('submit', createAcct);