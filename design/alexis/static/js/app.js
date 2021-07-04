window.addEventListener("load", myInit, true);

function myInit() {
    logo();
    page();
};

// Manage highlights for current page
function logo(e) {
    var currentURL = window.location.pathname;
    var activePath = "";
    if (currentURL == "/") {
        activePath = "home";
    }
    else if (currentURL == "/tags.html") {
        activePath = "tags";
    }
    else {
        var pathArray = window.location.pathname.split('/');
        activePath = pathArray[1];
    }
    document.getElementById(activePath).className += " active";
};

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

// Theme toggler
const themeNext = {
    dark: "light",
    light: "dark"
};

if (localStorage.getItem('theme')) {
    var theme = localStorage.getItem('theme');
    console.log(theme);
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(theme + '-theme');
    document.getElementById(themeNext[theme]).style.display = "flex";
    document.getElementById(theme).style.display = "none";

}

var switchTheme = document.getElementById('themeButton');
var toggleLight = document.getElementById('light');
var toggleDark = document.getElementById('dark');

switchTheme.addEventListener('click', function (e) {
    e.preventDefault();
});
toggleLight.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    toggleLight.style.display = "none";
    toggleDark.style.display = "flex";
});
toggleDark.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
    toggleLight.style.display = "flex";
    toggleDark.style.display = "none";
});









// PWA Service worker registration
navigator.serviceWorker &&
    navigator.serviceWorker.register('/SW.js').then(function (registration) {
    });