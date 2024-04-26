
function alertUser(message) 
{
  var alert = document.getElementById("alert");
  message = '<span class="closebtn">&times;</span>'
  + ' <strong>Error!  </strong>' + message;
  alert.setAttribute("style", "opacity: 1");
  alert.innerHTML = message;

  var close = document.getElementsByClassName("closebtn");
  var i;

  for (i = 0; i < close.length; i++) 
  {
    close[i].onclick = function(){
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
  }
  }
}

function resetFields() 
{
  var email = document.getElementById("email");
  email.setAttribute("value", "");
  var password = document.getElementById("password");
  password.setAttribute("value", "");
}

function navbarNotLoggedIn()
{
  var navbarPlaceholder = document.getElementById('navbarPlaceholder');
  navbarContent = '<nav class="navbar">' +
                      '   <ul>' +
                      '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
                      '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
                      '       <li><a href="#"onclick="navigateToLogin()">Login</a></li>' +
                      '   </ul>' +
                      '</nav>';
  navbarPlaceholder.innerHTML = navbarContent;
}

function replacePlaceholderNavbar() {
  var navbarPlaceholder = document.getElementById('navbarPlaceholder');
  
  navbarContent = '<nav class="navbar">' +
  '   <ul>' +
  '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
  '       <li ><a href="#" onclick="navigateToMyTrees()">My Trees</a></li>' +
  '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
  '       <li><a href="#"onclick="navigateToLogin()">Logout</a></li>' +
  '       <li><a href="#"onclick="navigateToAbout()">About</a></li>' +
  '   </ul>' +
  '</nav>';    
  navbarPlaceholder.innerHTML = navbarContent;
}

async function sendEmail() {
  document.getElementById('login').addEventListener('submit', function (event) 
  {
    event.preventDefault();
    const formData = new FormData(this);
    const jsonData = {};

    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    // console.log(jsonData);
    try
    {
      fetch("/ownerVerify", {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => {
          if(!response.ok)
          {
            alertUser("Invalid email");
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          else
          {
            return response.json()
          }
        })
        .then((json) => {
          if (json.message == "Email authenticated") {
            window.location.href = "/newpass";
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          throw error;
        });
    }
    catch(error)
    {
      navbarNotLoggedIn();
    }
  });
}


//Password reset portion
async function resetPass() {
  document.getElementById('newpassform').addEventListener('submit', function (event) 
  {
    event.preventDefault();
    const formData = new FormData(this);
    const jsonData = {};

    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    // console.log(jsonData);
    try
    {
      fetch("/ownerChange", {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => {
          if(!response.ok)
          {
            alertUser("Invalid pass");
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          else
          {
            return response.json()
          }
        })
        .then((json) => {
          if (json.message == "Pass changed") {
            window.location.href = "/login";
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          throw error;
        });
    }
    catch(error)
    {
      navbarNotLoggedIn();
    }
  });
}
