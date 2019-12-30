// DIG33 Internet Project Development

// ******************************************************************
// globals and helper functions
// ******************************************************************

var document;       // the web page
var window;         // the browser
var alert;          // browser alert messages
var console;        // browser console (for debug purposes)
var interval;       // for delayed instructions
var location;       // link address

// return a URL parameter
function getParameter(parameter) {
    "use strict";
    
    var pageURL = window.location.search.substring(1),
        parameters = pageURL.split('&'),
        parameterName,
        i;
    
    for (i = 0; i < parameters.length; i = i + 1) {
        parameterName = parameters[i].split('=');
        if (parameterName[0] === parameter) {
            return parameterName[1];
        }
    }
}

// returns today's UTC date in yyyy-mm-dd format
function getDate() {
    "use strict";
    
    var today = new Date(), day, month, year;
    
    // get current date members
    day = today.getUTCDate();
    month = today.getUTCMonth() + 1;
    year = today.getUTCFullYear();
    
    // concatenate each date member for fully formatted date
    today = day + '-' + month + '-' + year;
    
    return today;
}

// center element by id and size
function centerElement(elementID, elementWidth, elementHeight) {
    "use strict";
    
    var Xpos = (window.innerWidth - elementWidth) / 2,
        Ypos = (window.innerHeight - elementHeight) / 2;
    
    document.getElementById(elementID).style.left = Xpos + "px";
    document.getElementById(elementID).style.top = Ypos + "px";
}

// resize elements if window size changes
function resize() {
    "use strict";
    
    //centerElement('elementID', elementWidth, elementHeight);
}

// show block element by id
function showElement(elementID) {
    "use strict";
    
    document.getElementById(elementID).style.display = "block";
}

// hide element by id
function hideElement(elementID) {
    "use strict";
    
    document.getElementById(elementID).style.display = "none";
}

// ******************************************************************
// disclaimer functions
// ******************************************************************
function showLogin() {
    "use strict";
    
    hideElement("disclaimer");
    showElement("login");
}

function showExit() {
    "use strict";
    
    hideElement("disclaimer");
    showElement("exit");
}

function showDisclaimer() {
    "use strict";
    
    hideElement("exit");
    showElement("disclaimer");
}

// ******************************************************************
// login functions
// ******************************************************************
function showMenu() {
    "use strict";
    
    hideElement("login");
    hideElement("scores");
    hideElement("question");
    hideElement("game");
    showElement("menu");
}

function register() {
    "use strict";
    
    hideElement("login");
    showElement("menu");
}

// ******************************************************************
// main menu functions
// ******************************************************************
function playGame() {
    "use strict";
    
    hideElement("menu");
    showElement("game");
}

function showScores() {
    "use strict";
    
    hideElement("menu");
    showElement("scores");
}

function showQuestion() {
    "use strict";
    
    showElement("question");
}

function hideQuestion() {
    "use strict";
    
    hideElement("question");
}

// ******************************************************************
// scoreboard functions
// ******************************************************************
function shareScores() {
    "use strict";
    
    alert("URL copied to clipboard");
}

// ******************************************************************
// game functions
// ******************************************************************
function playGame() {
    "use strict";
    
    hideElement("menu");
    showElement("game");
}

// ******************************************************************
// initial startup function
// ******************************************************************
function start() {
    "use strict";
    
    hideElement("hide");
    showElement("disclaimer");
}