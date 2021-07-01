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

const themeMap = {
    dark: "light",
    light: "dark"
};

function toggleTheme() {
    const bodyClass = document.body.classList;
    theme = bodyClass[0].split("-")[0];
    bodyClass.replace(bodyClass[0], themeMap[theme] + "-theme");
    document.getElementById(theme).style.display = "flex";
    document.getElementById(themeMap[theme]).style.display = "none";

    console.log(theme);
    console.log(themeMap[theme]);
}

document.getElementById("themeButton").onclick = toggleTheme;

