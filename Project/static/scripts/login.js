// function showInput() {
//   document.getElementById('displaye').innerHTML =
//     document.getElementById("email").value;
//   document.getElementById('displayp').innerHTML =
//     document.getElementById("password").value;
// }
// async function loggedIn() {
//       console.log("Stuff changes");
//       try {
//         // Object to send to server
//         const loginInfo = {
//           email: document.getElementById("email").value,
//           password: document.getElementById("password").value,
//           loggedIn: true
//         };

//         // Send the object to the server
//         const response = await fetch('login',
//           {
//             method: 'POST',
//             headers:
//             {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(loginInfo)
//           });
//         console.log("Response");

//         // If the server sends back an error, throw it
//         if (!response.ok) {
//           console.log("Uh oh");
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         // Get response from server
//         const data = await response.json();

//         console.log('Success:', data.message);
//         try {
//           document.getElementById('email').value = data.message != Null ? data.message : "";
//         }
//         catch (error) {
//           document.getElementById('email').value = "";
//         }
//       }
//       catch (error) {
//         console.error('Error:', error);
//         throw error;
//       }

  
//}

document.addEventListener('DOMContentLoaded', deleteAllCookies);

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function deleteAllCookies() 
{
  var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) 
    {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        deleteCookie(name);
    }
}
async function replacePlaceholderNavbar(json) {
  var navbarPlaceholder = document.getElementById('navbarPlaceholder');
  console.log(json);
  var navbarContent = "";
  // Use express session for if user is logged in, show my trees and login, else opposite
  if(json.message === "Authentication failed" || json.message === "Internal Server Error")
  {
      navbarContent = '<nav class="navbar">' +
                      '   <ul>' +
                      '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
                      '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
                      '       <li><a href="#"onclick="navigateToLogin()">Login</a></li>' +
                      '       <li><a href="#"onclick="navigateToUI()">UI</a></li>' +
                      '       <li><a href="#"onclick="navigateToAbout()">About</a></li>' +
                      '   </ul>' +
                      '</nav>';
  }
  else
  {
      navbarContent = '<nav class="navbar">' +
      '   <ul>' +
      '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
      '       <li ><a href="#" onclick="navigateToMyTrees()">My Trees</a></li>' +
      '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
      '       <li><a href="#"onclick="navigateToLogin()">Login</a></li>' +
      '        <li><a href="#"onclick="navigateToUI()">UI</a></li>' +
      '       <li><a href="#"onclick="navigateToAbout()">About</a></li>' +
      '   </ul>' +
      '</nav>';
  }
      
  // Design the navbar
  
  // Replace the innerHTML with dynamic content
  navbarPlaceholder.innerHTML = navbarContent;
}

function navbarNotLoggedIn()
{
  var navbarPlaceholder = document.getElementById('navbarPlaceholder');
  navbarContent = '<nav class="navbar">' +
                      '   <ul>' +
                      '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
                      '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
                      '       <li><a href="#"onclick="navigateToLogin()">Login</a></li>' +
                      '       <li><a href="#"onclick="navigateToUI()">UI</a></li>' +
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
            console.log("Uh oh");
            navbarNotLoggedIn();
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          else
          {
            response.json()
          }
        })
        .then((json) => {
          replacePlaceholderNavbar(json);
          if (json.message == "Account authenticated") {
            window.location.href = "/mytrees";
          }
        })
        .catch(() => navbarNotLoggedIn());
    }
    catch(error)
    {
      navbarNotLoggedIn();
    }
  });
}