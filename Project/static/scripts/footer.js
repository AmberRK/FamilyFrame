function replacePlaceholderFooter() {
    var footerPlaceholder = document.getElementById('footerPlaceholder');

    //  var footerContent = '<footer class="site-footer">' +
    //                     '   <h2 class="footer-nav-heading">Family Frame ©2023<h2>' +
    //                     '</footer>';
    var footerContent = '<footer class="site-footer">' +
                        '   <h2 class="footer-nav-heading">Family Frame ©2023<h2>' +
                        '   <ul>' +
                        '       <li><a href="#"onclick="navigateToAbout()">About</a></li>' +
                        '   </ul>' +
                        '</footer>';
    footerPlaceholder.innerHTML = footerContent;
}