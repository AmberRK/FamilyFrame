function showInput() {
    document.getElementById('displaye').innerHTML = 
           document.getElementById("email").value;
    document.getElementById('displayp').innerHTML =
           document.getElementById("password").value;
}

async function loggedIn()
{
  console.log("Stuff changes");
  try{
    // Object to send to server
    const loginInfo = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        loggedIn: true
    };

    // Send the object to the server
    const response = await fetch('login', 
    {
      method: 'POST',
      headers: 
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginInfo)
    });
    console.log("Response");

    // If the server sends back an error, throw it
    if (!response.ok) 
    {
      console.log("Uh oh");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Get response from server
    const data = await response.json();

    console.log('Success:', data.message);
    try
    {
      document.getElementById('email').value = data.message != Null ? data.message : "";
    }
    catch(error)
    {
      document.getElementById('email').value = "";
    }
  }
  catch(error)
  {
    console.error('Error:', error);
    throw error;
  }

  replacePlaceholderNavbar();
}

async function replacePlaceholderNavbar() {
  var navbarPlaceholder = document.getElementById('navbarPlaceholder');
  
  let clickable = await checkLoggedIn();
  console.log(clickable);
  var navbarContent = "";
  // Use express session for if user is logged in, show my trees and login, else opposite
  if(clickable === null || clickable === "")
  {
      navbarContent = '<nav class="navbar">' +
                      '   <ul>' +
                      '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
                      '       <li style = color: #ccc; display: none; ><a href="#">My Trees</a></li>' +
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

async function checkLoggedIn() {
  try {
  const response = await fetch('index',
    {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      
    });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
      console.log('Success:', data.message, 'logged in.');
      try 
  {
    return (data.message != null ? data.message : "");
  }
  catch
  {
    return "";
  }
  }
catch (error) {
  console.error('Error:', error);
  throw error;	}
}