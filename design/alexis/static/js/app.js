window.onload = function (e) {
    var currentURL = window.location.pathname
    var activePath = ""
    if (currentURL == "/") {
        activePath = "home"
    } else {
        var pathArray = window.location.pathname.split('/')
        activePath = pathArray[1]
    }
    document.getElementById(activePath).className += " active"
}
