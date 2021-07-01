// Manage highlights for current page
window.onload = function (e) {
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
}


// Theme toggler
const themeMap = {
    dark: "light",
    light: "dark"
};

const theme = localStorage.getItem('theme')
    || (tmp = Object.keys(themeMap)[0],
        localStorage.setItem('theme', tmp),
        tmp);
const bodyClass = document.body.classList;
bodyClass.add(theme + "-theme");

function toggleTheme() {
    const current = localStorage.getItem('theme');
    const next = themeMap[current];

    bodyClass.replace(current + "-theme", next + "-theme");
    localStorage.setItem('theme', next);
}

document.getElementById("themeButton").onclick = toggleTheme;

// PWA Service worker registration
navigator.serviceWorker &&
    navigator.serviceWorker.register('SW.js').then(function (registration) {
    });