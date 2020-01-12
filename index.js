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

// id and position of in-game objects
var gameObjects = [
    [10, 20, "sprite01"]
];
// game object selected
var gameObject = [0, 0, "none"];

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
// function call order:
// 
// 1) click/touch event
// 2) getPos
// 3) getCell
// 4) calculateMove
// 5) showElementInCell or
// 6) moveAlongPath
// 7) animationStart
// 8) showElementInCell (repeated)
// 9) animationStop
// ******************************************************************

// start animation of element (and adds interval to intervals array)
function animationStart(elementID, startIndex, endIndex) {
    "use strict";
    
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
function showElementInCell(xPos, yPos, elementID) {
    "use strict";
    
    var zlayer, i;
    
    // an elementID must be given to this function
    if (elementID !== undefined) {
        zlayer = parseInt(yPos, 10) + 9;
        document.getElementById(elementID).style.zIndex = zlayer.toString();
        
        // DEBUG MODE
        if (getParameter("debug") === "true") {
            console.log(elementID + ", " + xPos + ", " + yPos + ", " + zlayer);
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

// move an object along a path at a set interval
function moveAlongPath(startX, startY, endX, endY, elementID) {
    "use strict";
    
    showElementInCell(startX, startY, elementID);
}

// select and or move an object
function calculateMove(xPos, yPos, elementID) {
    "use strict";
    
    var i, xPosInt, yPosInt, xObjInt, yObjInt;
    
    // human event
    if (elementID === undefined) {
        // check if the selected cell contains a game object (sprite etc.)
        for (i = 0; i < gameObjects.length; i = i + 1) {
        
            xPosInt = parseInt(xPos, 10);
            yPosInt = parseInt(yPos, 10);
            xObjInt = parseInt(gameObjects[i][0], 10);
            yObjInt = parseInt(gameObjects[i][1], 10);
            
            // object in cell
            if (xPosInt === xObjInt && yPosInt === yObjInt) {
                // check if user has already selected an object
                if (gameObject[2] === "none") {
                    // user selects object
                    gameObject[0] = gameObjects[i][2];
                    gameObject[1] = gameObjects[i][2];
                    gameObject[2] = gameObjects[i][2];
                    
                    // highlight selected object
                    elementID = "game-cell";
                    showElementInCell(xPos, yPos, elementID);
                    
                // user has already selected an object (can't move)
                } else {
                    // DEBUG MODE
                    if (getParameter("debug") === "true") {
                        console.log("cell occupied");
                    }
                    elementID = undefined;
                }
            
            // empty cell
            } else {
                // no object previously selected (can't move)
                if (gameObject[2] === "none") {
                    // DEBUG MODE
                    if (getParameter("debug") === "true") {
                        console.log("cell empty");
                    }
                    elementID = undefined;
                    
                // object selected and destination selected
                } else {
                    // move object to cell
                    elementID = gameObject[2];
                    gameObjects[i][0] = xPosInt;
                    gameObjects[i][1] = yPosInt;
                    
                    // clear gameObject
                    gameObject[0] = 0;
                    gameObject[1] = 1;
                    gameObject[2] = "none";
                    
                    // hide selection box
                    hideElement("game-cell");
                    
                    // move oject along calculated path
                    moveAlongPath(xPosInt, yPosInt,
                                  xObjInt, yObjInt, elementID);
                }
            }
        }
        
        // DEBUG MODE
        if (getParameter("debug") === "true") {
            console.log("gameObject: " + gameObject[2]);
        }
    // computer event
    } else {
        // calculate automatic move
        
        // TEST CODE - REMOVE TO IMPLEMENT COMPUTER MOVE
        animationStart(elementID, 9, -27);
        showElementInCell(xPos, yPos, elementID);
    }
}

// get cell number
function getCell(boardXvmin, boardYvmin) {
    "use strict";
    
    // convert click vmin coordinates into cell x y coordinates
    var i, xPos, yPos, xWidth = 90 / 20, yHeight = 90 / 40;
    
    xPos = (boardXvmin / xWidth).toFixed(0);
    yPos = (boardYvmin / yHeight).toFixed(0);
    
    // if a valid cell was chosen, calculate what to do next
    if (xPos > 0 && xPos < 20 && yPos > 0 && yPos < 40) {
        calculateMove(xPos, yPos);
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
}

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
    hideElement("question");
    showElement("transparency");
    showElement("menu");
}

// ********************
// not in use
// ********************
function sendEmailVerification() {
    "use strict";
    
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // [START_EXCLUDE]
        alert('Email verification sent.');
        // [END_EXCLUDE]
    });
    
    // [END sendemailverification]
    document.getElementById('quickstart-verify-email').hidden = false;
}
// ********************
// ********************
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
    
    // display startup environment and sprite objects
    for (i = 0; i < gameObjects.length; i = i + 1) {
        calculateMove(gameObjects[i][0], gameObjects[i][1], gameObjects[i][2]);
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
function showQuestion() {
    "use strict";
    
    hideElement("game-controls");
    showElement("transparency");
    showElement("question");
}

function hideQuestion() {
    "use strict";
    
    hideElement("transparency");
    hideElement("question");
    showElement("game-controls");
}

// ******************************************************************
// initial startup function
// ******************************************************************
function start() {
    "use strict";
    
    document.addEventListener("click", getPos, false);
    document.addEventListener("touchstart", getPos, false);
    
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