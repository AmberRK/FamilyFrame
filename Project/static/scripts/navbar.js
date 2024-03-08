function replacePlaceholderNavbar() {
    var navbarPlaceholder = document.getElementById('navbarPlaceholder');

    // Design the navbar
    var navbarContent = '<nav class="navbar">' +
                        '   <ul>' +
                        '       <li><a href="#"onclick="navigateToHome()">Home</a></li>' +
                        '       <li><a href="#"onclick="navigateToEditor()">Tree Editor</a></li>' +
                        '       <li><a href="#"onclick="navigateToLogin()">Login</a></li>' +
                        '   </ul>' +
                        '</nav>';
    // Replace the innerHTML with dynamic content
     navbarPlaceholder.innerHTML = navbarContent;
}
function navigateToHome() {
	window.location.href = "/home";
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