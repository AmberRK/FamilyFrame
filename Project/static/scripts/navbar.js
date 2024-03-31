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
                        '       <li><a href="#"onclick="navigateToUI()">UI</a></li>' +
                        '       <li><a href="#"onclick="navigateToAbout()">About</a></li>' +
                        '       <li><a href="#"onclick="navigateToLogin()">Login</a></li>' +
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
        '        <li><a href="#"onclick="navigateToUI()">UI</a></li>' +
        '       <li><a href="#"onclick="navigateToAbout()">About</a></li>' +
        '       <li><a href="#"onclick="navigateToLogin()">Login</a></li>' +
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