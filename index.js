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
var firebase;       // google firebase

var clickXpx;       // click x position in pixels
var clickYpx;       // click y position in pixels
var clickXvmin;     // click x position in viewport min units
var clickYvmin;     // click y position in viewport min units
var boardXpx;       // click x position in pixels on game board
var boardYpx;       // click y position in pixels on game board
var boardXvmin;     // click x position in viewport min units on game board
var boardYvmin;     // click y position in viewport min units on game board

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

// get click/tap position
function getPos(e) {
    "use strict";
    
    var vmin,        // pixels per viewport min unit
        offsetXpx,   // offset game board start x pos in px
        offsetYpx,   // offset game board start y pos in px
        offsetXvmin, // offset game board start x pos in vmin
        offsetYvmin; // offset game board start y pos in vmin
    
    if (window.innerWidth > window.innerHeight) {
        // landscape mode
        vmin = window.innerHeight / 100;
        offsetXpx = (window.innerWidth - (vmin * 90)) / 2;
        offsetYpx = vmin * 5;
        offsetXvmin = (((window.innerWidth -
                         window.innerHeight) / vmin) / 2) + 5;
        offsetYvmin = 5;
    } else {
        // portrait mode
        vmin = window.innerWidth / 100;
        offsetXpx = vmin * 5;
        offsetYpx = (window.innerHeight - (vmin * 90)) / 2;
        offsetXvmin = 5;
        offsetYvmin = (((window.innerHeight -
                         window.innerWidth) / vmin) / 2) + 5;
    }
    
    clickXpx = e.clientX;
    clickYpx = e.clientY;
    clickXvmin = parseInt(clickXpx / vmin, 0);
    clickYvmin = parseInt(clickYpx / vmin, 0);
    boardXpx = parseInt(e.clientX - offsetXpx, 0);
    boardYpx = parseInt(e.clientY - offsetYpx, 0);
    boardXvmin = parseInt(boardXpx / vmin, 0);
    boardYvmin = parseInt(boardYpx / vmin, 0);
    
    // DEBUG - REMOVE LATER
    console.log("clickXpx = " + clickXpx);
    console.log("clickYpx = " + clickYpx);
    console.log("clickXvmin = " + clickXvmin);
    console.log("clickYvmin = " + clickYvmin);
    console.log("boardXpx = " + boardXpx);
    console.log("boardYpx = " + boardYpx);
    console.log("boardXvmin = " + boardXvmin);
    console.log("boardYvmin = " + boardYvmin);
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

// **********************************
// *********** not in use ***********
// **********************************
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
// **********************************
// **********************************
// **********************************

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
        // Update successful.
        verify = true;
    }).catch(function (error) {
    // An error happened.
        verify = false;
    });
    
    setTimeout(function () {
        if (verify === true) {
            hideElement("username");
            document.getElementById('login-username').value = "";
            showElement("menu");
            // Debug - remove later
            console.log(user.displayName);
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
    
    hideElement("menu");
    hideElement("transparency");
    showElement("game");
    showElement("game-controls");
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
    
    alert("URL copied to clipboard");
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
    
    window.addEventListener("click", getPos, false);
    
    hideElement("game-controls");
    showElement("transparency");
    hideElement("hide");
    showElement("disclaimer");
}