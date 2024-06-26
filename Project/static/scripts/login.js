document.getElementById("togglePasswordVisibility").addEventListener("click", togglePassword);
function togglePassword(event) {
  event.preventDefault();
  var passwordField = document.getElementById("password");
  var eyeIcon = document.getElementById("eyeIcon");

  if (passwordField.type === "password") 
  {
    passwordField.type = "text";
    eyeIcon.src = "../images/eye-outline.svg"; // Change to hide eye icon
  } 
  else 
  {
    passwordField.type = "password";
    eyeIcon.src = "../images/eye-off-outline.svg"; // Change to show eye icon
  }
}

function resetFields() 
{
  var email = document.getElementById("email");
  email.setAttribute("value", "");
  var password = document.getElementById("password");
  password.setAttribute("value", "");
}

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

async function login() {
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
      fetch("/existingUser", {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => {
          if(!response.ok)
          {
            alertUser("Invalid email or password");
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          else
          {
            return response.json()
          }
        })
        .then((json) => {
          if (json.message == "Account authenticated") {
            window.location.href = "/mytrees";
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

  function goToForgetPass() {
    window.location.href = "/forgotpass";
  }

  function goToSignUp() {
    window.location.href = "/newuser";
  }