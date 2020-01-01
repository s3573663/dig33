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

/*global firebase*/

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
    showElement("transparency");
    showElement("menu");
}

// Not currently in use
function sendEmailVerification() {
    "use strict";
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
    document.getElementById('quickstart-verify-email').hidden = false;
    
}

function register() {
    "use strict";
    
    var email, password, username, user, verify;
    verify = true;
    email = document.getElementById('login-email').value;
    password = document.getElementById('login-password').value;
    username = document.getElementById('register-username').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    if (username.length <= 0) {
        alert('Please enter a username.');
        return;
    }
    // Create user with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode, errorMessage;
        errorCode = error.code;
        errorMessage = error.message;

        if (errorCode === 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        verify = false;
    });
    
      
    setTimeout(function () {
        if (verify === true) {
            user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: username
            }).then(function () {
                // Update successful.
                verify = true;
            }).catch(function (error) {
                // An error happened.
                verify = false;
            });
            hideElement("login");
            showElement("menu");
        }
    }, 5000);
}


function logIn() {
    "use strict";
    
    // Sign current user out
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    
    var email, password, verify;
    verify = true;
    email = document.getElementById('login-email').value;
    password = document.getElementById('login-password').value;
    
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length === 0) {
        alert('Please enter a password');
        return;
    }
    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode, errorMessage;
        errorCode = error.code;
        errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        verify = false;
    });
    
    // Call showMenu if no errors are thrown
    setTimeout(function () {
        if (verify === true) {
            showMenu();
        }
    }, 5000);
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
    
    hideElement("game-controls");
    showElement("transparency");
    hideElement("hide");
    showElement("disclaimer");
    //initApp();
}