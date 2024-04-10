document.addEventListener('DOMContentLoaded', checkLoggedIn);


function replacePlaceholderNavbar() {
    var navbarPlaceholder = document.getElementById('navbarPlaceholder');
    
    navbarContent = '<nav class="navbar">' +
    '   <ul>' +
    '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
    '       <li ><a href="#" onclick="navigateToMyTrees()">My Trees</a></li>' +
    '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
    '        <li><a href="#"onclick="navigateToUI()">UI</a></li>' +
    '       <li><a href="#"onclick="navigateToLogin()">Logout</a></li>' +
    '   </ul>' +
    '</nav>';    
    navbarPlaceholder.innerHTML = navbarContent;
  }


function navbarNotLoggedIn()
{
  var navbarPlaceholder = document.getElementById('navbarPlaceholder');
  navbarContent = '<nav class="navbar">' +
                      '   <ul>' +
                      '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
                      '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
                      '       <li><a href="#"onclick="navigateToUI()">UI</a></li>' +
                      '       <li><a href="#"onclick="navigateToLogin()">Login</a></li>' +
                      '   </ul>' +
                      '</nav>';
  navbarPlaceholder.innerHTML = navbarContent;
}

async function checkLoggedIn() {
    try 
    {
		fetch("/profileJWT")
        .then((response) => {
        if (!response.ok) 
        {
            navbarNotLoggedIn();
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        else 
        {
            replacePlaceholderNavbar();
        }
        })
        .catch(() => navbarNotLoggedIn());
    }
	catch (error) 
    {
		console.error('Error:', error);
		throw error;
    }
}

function navigateToHome() {
	window.location.href = "/home";
}

function navigateToMyTrees() {
	window.location.href = "/mytrees";
}

function navigateToEditor() {
	window.location.href = "/";
}

function navigateToAbout() {
	window.location.href = "/about";
}

function navigateToUI() {
	window.location.href = "/ui";
}

function navigateToLogin() {
	window.location.href = "/login";
}