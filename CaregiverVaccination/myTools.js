const appMode = "dev"; // dev, prod

function clog(str, other = null) {
    if (appMode === "dev") {
        console.log(str, other);
    }
}