window.addEventListener("load", myInit, true);

function myInit() {
    /* Manage highlights for current page */
    function logo(e) {
        try {
            var currentURL = window.location.pathname;
            var activePath = "";
            console.log(currentURL)
            if (currentURL == "/") {
                activePath = "home";
            }
            else if (currentURL == "/tags") {
                activePath = "tag";
            }
            else {
                var pathArray = window.location.pathname.split('/');
                activePath = pathArray[1];
            }
            document.getElementById(activePath).className += " active";
        }
        catch (err) {
            document.getElementById("home").className += " active";
        }
    };
    logo();

    // Pagination Handler
    function page(e) {
        var selection = document.querySelectorAll('ul.pagination')[0]
        if (selection) {
            pageItems = document.querySelectorAll('ul.pagination')[0].getElementsByClassName("page-item");
            for (let i = 0; i < pageItems.length; i++) {
                if (pageItems[i].getElementsByTagName("a")[0].href == document.location.href) {
                    pageItems[i].getElementsByTagName("a")[0].removeAttribute("href");
                    if (!((i == 0) || (i == (pageItems.length - 1)))) {
                        pageItems[i].classList.add("active");
                    };
                };
            };
        };
    };
    page();
};






/**
// PWA Service worker registration
navigator.serviceWorker &&
    navigator.serviceWorker.register('/SW.js').then(function (registration) {
    });

**/

