function replacePlaceholderFooter() {
    var footerPlaceholder = document.getElementById('footerPlaceholder');

    // Design the navbar
    var footerContent = '<footer class="site-footer">' +
                        '   <h2 class="footer-nav-heading">Family Frame<h2>' +
                        '   <ul>' +
                        '       <li><a href="#"onclick="navigateToAbout()">About</a></li>' +
                        '   </ul>' +
                        '</footer>';
    // Replace the innerHTML with dynamic content
    footerPlaceholder.innerHTML = footerContent;
}