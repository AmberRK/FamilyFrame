function replacePlaceholderNavbar() {
  var navbarPlaceholder = document.getElementById('navbarPlaceholder');
  
  navbarContent = '<nav class="navbar">' +
  '   <ul>' +
  '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
  '       <li ><a href="#" onclick="navigateToMyTrees()">My Trees</a></li>' +
  '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
  '       <li><a href="#"onclick="navigateToLogin()">Logout</a></li>' +
  '        <li><a href="#"onclick="navigateToUI()">UI</a></li>' +
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
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          else
          {
            return response.json()
          }
        })
        .then((json) => {
          if (json.message == "Account authenticated") {
            replacePlaceholderNavbar();
            window.location.href = "/mytrees";
          }
        })
    }
    catch(error)
    {
      navbarNotLoggedIn();
    }
  });
}