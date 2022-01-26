let appMode = "prod"; // dev, prod

/**
 * Short form for Console.log(). 
 * Use appMode: dev - show output, prod - hide output
 * 
 * @param {string} str 
 * @param {string, variable} other 
 */
function clog(str, other = null) {
    if (appMode === "dev") {
        console.log(str, other);
    }
}


/**
 * Add script to the html body tag
 * @param {string} url 
 * @param {function} callBackFunction 
 */

function addScript(url, callBackFunction = '') {
    const scriptTag = document.createElement('script');
    scriptTag.src = url;
    if (typeof callBackFunction === 'function') {
        scriptTag.onload = callBackFunction();
        scriptTag.onreadystatechange = callBackFunction();
    } 
    
    document.body.appendChild(scriptTag);
}


/**
 * 
 * @param {ojbect} urlObject - { obj: 'url String'} 
 * 
 * Ex.: 
 *  const urls = {
        clog: 'https://cdn.jsdelivr.net/gh/rail-sabirov/FS@caregiver_vaccination/CaregiverVaccination/myTools.js',
        FsDb: 'https://cdn.jsdelivr.net/gh/rail-sabirov/FS@caregiver_vaccination/CaregiverVaccination/FsDb.js',
        CaregiverVaccination: 'https://cdn.jsdelivr.net/gh/rail-sabirov/FS@caregiver_vaccination/CaregiverVaccination/CaregiverVaccination.js'
    };

    loadGhJs(urls);
 */
function loadGhJs(urlObject = {}) {
    for(key in urlObject) {
        if (typeof key === undefined) {
            addScript(urlObject[key]);
        }
    }
}
