// DIG33 Internet Project Development

// ******************************************************************
// globals and helper functions
// ******************************************************************

var document;         // the web page
var window;           // the browser
var alert;            // browser alert messages
var console;          // browser console (for debug purposes)
var location;         // link address
var firebase;         // google firebase

var intervals = [];   // for delayed instructions (interval)
var animated = [];    // for delayed instructions (elementID)

// library of objects available (walls etc)
var gameObjects = [
    [0, 0, "wall"],
    [0, 0, "bar"],
    [0, 0, "speakers"],
    [0, 0, "mixdesk"]
];

// objects in current level
var levelObjects = [];

// library of sprites available
var gameSprites = [
    [3, 11, "dj", "SE"],
    [17, 11, "bartender", "SW"],
    [17, 33, "bouncer01", "SE"],
    [15, 35, "bouncer02", "SE"],
    [17, 35, "patron01", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron02", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron03", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron04", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron05", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron06", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron07", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron08", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron09", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron10", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron11", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron12", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron13", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron14", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron15", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron16", "NW", "Desperados", "dance", "social"],
    [17, 35, "patron17", "NW", "Desperados", "dance", "social"]
];

// sprites in current level
var levelSprites = [
    [3, 11, "dj", "SE"],
    [17, 11, "bartender", "SW"],
    [17, 33, "bouncer01", "SE"],
    [15, 35, "bouncer02", "SE"]
];

// sprite currently selected by player
var selectedSprite = [];

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

// returns a random integer between max and min (including min)
function getRandomInt(min, max) {
    "use strict";
    
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
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
// game functions
// ******************************************************************

// start animation of element (and adds interval to intervals array)
function animationStart(elementID, startIndex, endIndex) {
    "use strict";
    
    // example usage:
    // walking SW: animationStart(elementID, 0, -18);
    // walking NW: animationStart(elementID, -27, -45);
    // walking SE: animationStart(elementID, -54, -72);
    // walking NE: animationStart(elementID, -81, -99);
    // dancing SW: animationStart(elementID, -108, -126);
    
    var position = parseInt(startIndex, 10);
    
    animated.push(elementID);
    intervals.push(setInterval(function () {
        position = position - startIndex;
        if (position === endIndex) {
            position = 0;
        }
        document.getElementById(elementID).style.backgroundPositionX =
            position + "vmin";
    }, 200));
}

// stop animation of element (and removes interval from intervals array)
function animationStop(elementID) {
    "use strict";
    
    var i = animated.indexOf(elementID);
    
    animated.splice(i, 1);
    clearInterval(intervals[i]);
    intervals.splice(i, 1);
}

// show element by id in cell x y
function showElementInCell(xPos, yPos, elementID, facing) {
    "use strict";
    
    var zlayer, i;
    
    // an elementID must be given to this function
    if (elementID !== undefined) {
        zlayer = parseInt(yPos, 10) + 9;
        document.getElementById(elementID).style.zIndex = zlayer.toString();
        
        // set the direction that the element faces (SW, SE, NW, NE)
        if (facing === "NW") {
            document.getElementById(elementID).style.backgroundPositionX =
                "-27vmin";
        } else if (facing === "NE") {
            document.getElementById(elementID).style.backgroundPositionX =
                "-81vmin";
        } else if (facing === "SE") {
            document.getElementById(elementID).style.backgroundPositionX =
                "-54vmin";
        } else {
            document.getElementById(elementID).style.backgroundPositionX =
                "0vmin";
        }
        
        // DEBUG MODE
        if (getParameter("debug") === "true") {
            console.log(elementID + ", " + xPos + ", " + yPos + ", " + facing);
        }
        
        // a "game-cell" element is a cell highlight, which is only 20px high
        if (elementID === "game-cell") {
            xPos = (xPos * 4.5) - 4.5;
            yPos = (yPos * 2.25) - 2.25;
            
        // a standard sprite object (40px x 40px)
        } else {
            xPos = (xPos * 4.5) - 4.5;
            yPos = (yPos * 2.25) - 9;
        }
        
        document.getElementById(elementID).style.left = xPos + "vmin";
        document.getElementById(elementID).style.top = yPos + "vmin";
        showElement(elementID);
    }
}

// not in use
// ********************
// get cell number
/*function getCell(boardXvmin, boardYvmin) {
    "use strict";
    
    // convert click vmin coordinates into cell x y coordinates
    var i, xPos, yPos, xWidth = 90 / 20, yHeight = 90 / 40;
    
    xPos = (boardXvmin / xWidth).toFixed(0);
    yPos = (boardYvmin / yHeight).toFixed(0);
    
    // if a valid cell was chosen, calculate what to do next
    if (xPos > 0 && xPos < 20 && yPos > 0 && yPos < 40) {
        return [xPos, yPos];
    }
}

// get click/tap position
function getPos(e) {
    "use strict";
    
    var vmin,       // pixels per viewport min unit
        vminWidth,  // width in viewport min units
        vminHeight, // height in viewport min units
        offsetXpx,  // offset game board start x pos in px
        offsetYpx,  // offset game board start y pos in px
        boardXpx,   // click x position in pixels on game board
        boardYpx,   // click y position in pixels on game board
        boardXvmin, // click x position in viewport min units on game board
        boardYvmin; // click y position in viewport min units on game board
    
    // convert click pixel coordinates into vmin coordinates
    if (window.innerWidth > window.innerHeight) {
        // landscape mode
        vmin = window.innerHeight / 100;
        vminWidth = window.innerWidth / vmin;
        vminHeight = 100;
        offsetXpx = ((vminWidth - 90) / 2) * vmin;
        offsetYpx = vmin * 5;
    } else {
        // portrait mode
        vmin = window.innerWidth / 100;
        vminWidth = 100;
        vminHeight = window.innerHeight / 100;
        offsetXpx = vmin * 5;
        offsetYpx = ((vminHeight - 90) / 2) * vmin;
    }
    
    boardXpx = e.clientX - offsetXpx;
    boardYpx = e.clientY - offsetYpx;
    boardXvmin = boardXpx / vmin;
    boardYvmin = boardYpx / vmin;
    
    // determine which board square was selected 
    getCell(boardXvmin, boardYvmin);
}*/
// ********************

// ******************************************************************
// disclaimer functions
// ******************************************************************
function showLogin() {
    "use strict";
    
    hideElement("disclaimer");
    hideElement("username");
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
function showUsername() {
    "use strict";
    
    hideElement("login");
    showElement("username");
}

function showMenu() {
    "use strict";
    
    hideElement("login");
    hideElement("scores");
    hideElement("quit");
    showElement("transparency");
    showElement("menu");
}

// not in use
// ********************
/*function sendEmailVerification() {
    "use strict";
    
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // [START_EXCLUDE]
        alert('Email verification sent.');
        // [END_EXCLUDE]
    });
    
    // [END sendemailverification]
    document.getElementById('quickstart-verify-email').hidden = false;
}*/
// ********************

function register() {
    "use strict";
    
    var email, password, verify;
    verify = true;
    email = document.getElementById('login-email').value;
    password = document.getElementById('login-password').value;
 
    if (email.length < 10) {
        alert('Please enter a valid email address.');
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
        return;
    }
    if (password.length < 8) {
        alert('Please enter a password at least 8 characters in length.');
        document.getElementById("login-password").value = "";
        return;
    }
    
    // create a new user with a valid email address and password.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // handle errors
        var errorCode, errorMessage;
        errorCode = error.code;
        errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        showElement("login");
        verify = false;
    });
    
    setTimeout(function () {
        if (verify === true) {
            hideElement("login");
            email = document.getElementById('login-email').value = "";
            password = document.getElementById('login-password').value = "";
            showElement("username");
        }
    }, 5000);
}

function registerUsername() {
    "use strict";
    
    var user, username, verify;
    user = firebase.auth().currentUser;
    username = document.getElementById('login-username').value;
    
    if (username.length < 2) {
        alert('Please enter a username at least 2 characters in length.');
        document.getElementById('login-username').value = "";
        return;
    }
    
    user.updateProfile({
        displayName: username
    }).then(function () {
        // update successful.
        verify = true;
    }).catch(function (error) {
        // an error happened.
        verify = false;
    });
    
    setTimeout(function () {
        if (verify === true) {
            hideElement("username");
            document.getElementById('login-username').value = "";
            showElement("menu");
            
            // DEBUG MODE
            if (getParameter("debug") === "true") {
                console.log(user.displayName);
            }
        }
    }, 5000);
}

function login() {
    "use strict";
    
    // sign out current user
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    
    var email, password, verify;
    verify = true;
    email = document.getElementById('login-email').value;
    password = document.getElementById('login-password').value;
    
    if (email.length < 10) {
        alert('Please enter a valid email address.');
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
        return;
    } else if (password.length < 8) {
        alert('Please enter a password at least 8 characters in length.');
        document.getElementById("login-password").value = "";
        return;
    } else {
        hideElement("login");
    }
    
    // sign in with valid email address and password
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // handle errors
        var errorCode, errorMessage;
        errorCode = error.code;
        errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        showElement("login");
        verify = false;
    });
    
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
    
    // call showMenu() if no errors are thrown
    setTimeout(function () {
        if (verify === true) {
            showMenu();
        }
    }, 5000);
}

// if user does not complete registration, remove the email from firebase
function deleteUser() {
    "use strict";
    
    var user = firebase.auth().currentUser;
    
    user.delete().then(function () {
    // user deleted.
    }).catch(function (error) {
    // an error happened.
    });
    
    document.getElementById('login-username').value = "";
    showLogin();
}

// log user out of game
function logOut() {
    "use strict";
    
    firebase.auth().signOut();
    
    hideElement("menu");
    hideElement("username");
    showElement("login");
}

// send a email link to change password
function resetPassword() {
    "use strict";
    
    var email, errorCode, errorMessage;
    
    email = document.getElementById('login-email').value;
    
    if (email.length < 10) {
        alert('Please enter a valid email address.');
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
        return;
    }
    
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert('Password reset email sent.');
    }).catch(function (error) {
        errorCode = error.code;
        errorMessage = error.message;
        
        if (errorCode === 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode === 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
    });
}

// ******************************************************************
// main menu functions
// ******************************************************************
function playGame() {
    "use strict";
    
    var i;
    
    hideElement("menu");
    hideElement("transparency");
    showElement("game");
    showElement("game-controls");
    
    // load game objects
    for (i = 0; i < levelObjects.length; i = i + 1) {
        showElementInCell(levelSprites[i][0], levelSprites[i][1],
                          levelSprites[i][2]);
    }
    
    // load sprite objects
    for (i = 0; i < levelSprites.length; i = i + 1) {
        showElementInCell(levelSprites[i][0], levelSprites[i][1],
                          levelSprites[i][2], levelSprites[i][3]);
    }
}

function showScores() {
    "use strict";
    
    hideElement("menu");
    showElement("scores");
}

function hideMenu() {
    "use strict";
    
    hideElement("menu");
    hideElement("username");
    showElement("login");
}

// ******************************************************************
// scoreboard functions
// ******************************************************************
function shareScores() {
    "use strict";
    
    alert("URL copied to clipboard (not really!)");
}

// ******************************************************************
// game functions
// ******************************************************************
function showQuit() {
    "use strict";
    
    hideElement("game-controls");
    hideElement("bubble-large");
    showElement("transparency");
    showElement("quit");
}

function hideQuit() {
    "use strict";
    
    hideElement("transparency");
    hideElement("quit");
    showElement("game-controls");
}

// this function is triggered when the player clicks on a speech bubble.
// it will present in-game choices in the "bubble-large" element and
// then move the characters accordingly once a choice is chosen.
function getMove(elementID) {
    "use strict";
    
    document.getElementById("bubble-large").innerHTML =
        "you have clicked on a choice bubble!";
}

// this function is triggered when the player clicks on a sprite.
// It will display a random message from the sprite in the
// "bubble-large" element
function speak(elementID) {
    "use strict";
    
    var phrases = [
        "it's going to be a fun night",
        "i love my job",
        "wait for the drop",
        "i've got some bangers lined up",
        "stop bothering me",
        "the glass is half full when i pour it",
        "when i drink, i can almost remember what happy felt like",
        "ever wonder why that desperados beer is so tasty?",
        "yes the glasses have been dried thoroughly",
        "no, i only make these 3 cocktails",
        "i'm cold",
        "ID please",
        "no it's not a backpack, i got that wagon on me",
        "if you can still turn your head, your traps aren't big enough",
        "when i need calcium, i just rub milk all over my legs"
    ];
    
    showElement("bubble-large");
    
    if (elementID === "dj") {
        document.getElementById("bubble-large").innerHTML =
            "the " + elementID + " says: " +
            phrases[getRandomInt(0, 5)];
    } else if (elementID === "bartender") {
        document.getElementById("bubble-large").innerHTML =
            "the " + elementID + " says: " +
            phrases[getRandomInt(5, 10)];
    } else if (elementID === "bouncer01") {
        document.getElementById("bubble-large").innerHTML =
            elementID + " says: " +
            phrases[getRandomInt(10, 12)];
    } else if (elementID === "bouncer02") {
        document.getElementById("bubble-large").innerHTML =
            elementID + " says: " +
            phrases[getRandomInt(12, 15)];
    }
}

// ******************************************************************
// initial startup function
// ******************************************************************
function start() {
    "use strict";
    
    // not in use
    // ********************
    //document.addEventListener("click", getPos, false);
    //document.addEventListener("touchstart", getPos, false);
    // ********************
    
    if (getParameter("debug") === "true") {
        //start in debug mode (skips all menus)
        hideElement("hide");
        hideElement("disclaimer");
        playGame();
    } else {
        //start normally
        hideElement("game-controls");
        showElement("transparency");
        hideElement("hide");
        showElement("disclaimer");
    }
}