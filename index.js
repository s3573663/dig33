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

// center element on screen by id and size
function centerElement(elementID, elementWidth, elementHeight) {
    "use strict";
    
    var Xpos = (window.innerWidth - elementWidth) / 2,
        Ypos = (window.innerHeight - elementHeight) / 2;
    
    document.getElementById(elementID).style.left = Xpos + "px";
    document.getElementById(elementID).style.top = Ypos + "px";
}

// center element by id and size
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
// login functions
// ******************************************************************


// ******************************************************************
// menu functions
// ******************************************************************


// ******************************************************************
// game functions
// ******************************************************************


// ******************************************************************
// initial startup function
// ******************************************************************
function start() {
    "use strict";
    
    hideElement("hide");
    //showElement("transparency");
}