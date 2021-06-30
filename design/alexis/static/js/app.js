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
        console.log(activePath);
    }
    document.getElementById(activePath).className += " active";
}
