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

var timer;            // game timer interval
var minutes;          // game timer (minutes left in game)
var seconds;          // game timer (seconds left in game)
var counter;          // game counter interval

var score;            // game score (number of patrons in club)

var intervals = [];   // for sprite animation (interval)
var animated = [];    // for sprite animation (elementID)
var sequences = [];   // for sprite animation sequences (interval)
var paths = [];       // for sprite animation sequences (elementID)

// library of objects available (walls etc)
var gameObjects = [
    [0, 0, "wall"],
    [0, 0, "wallleft"],
    [0, 0, "wallright"],
    [0, 0, "wallcorner"],
    [0, 0, "wallcornerright"],
    [0, 0, "wallhalfright"],
    [0, 0, "wallentrance"],
    [0, 0, "bar"],
    [0, 0, "bartap"],
    [0, 0, "barlefttop"],
    [0, 0, "mixdesk"]
];

// objects in current level
var levelObjects = [
    [1, 24, "wall01"], [2, 25, "wall02"],
    [3, 26, "wall03"], [4, 27, "wall04"],
    [5, 28, "wall05"], [6, 29, "wall06"],
    [7, 30, "wall07"], [8, 31, "wall08"],
    [9, 32, "wall09"], [10, 33, "wall10"],
    [19, 26, "wall11"], [18, 27, "wallhalfright12"],
    [12, 33, "wall23"], [11, 34, "wall24"],
    [1, 26, "wallleft25"], [2, 27, "wallleft26"],
    [3, 28, "wallleft27"], [4, 29, "wallleft28"],
    [5, 30, "wallleft29"], [6, 31, "wallleft30"],
    [7, 32, "wallleft31"], [8, 33, "wallleft32"],
    [9, 34, "wallleft33"], [10, 35, "wallleft34"],
    [19, 28, "wallright35"], [18, 29, "wallright36"],
    [17, 30, "wallright37"], [16, 31, "wallcornerright38"],
    [14, 33, "wallright39"], [13, 34, "wallright40"],
    [12, 35, "wallright41"], [11, 36, "wallcorner42"],
    [1, 28, "wallleft43"], [2, 29, "wallleft44"],
    [3, 30, "wallleft45"], [4, 31, "wallleft46"],
    [5, 32, "wallleft47"], [6, 33, "wallleft48"],
    [7, 34, "wallleft49"], [8, 35, "wallleft50"],
    [9, 36, "wallleft51"], [10, 37, "wallleft52"],
    [19, 30, "wallright53"], [18, 31, "wallright54"],
    [17, 32, "wallright55"], [16, 33, "wallcorner56"],
    [14, 35, "wallright57"], [13, 36, "wallright58"],
    [12, 37, "wallright59"], [11, 38, "wallcorner60"],
    [12, 13, "bar61"], [13, 14, "bar62"],
    [14, 15, "bartap63"], [15, 16, "bar64"],
    [16, 17, "bar65"], [17, 18, "bar66"],
    [18, 19, "bar67"], [19, 20, "barlefttop68"],
    [4, 13, "mixdesk69"], [13, 26, "wallentrance70"]
];

// library of sprites available
var gameSprites = [
    [3, 11, "dj01", "SE"],
    [19, 15, "bartender01", "NW"],
    [17, 33, "bouncer01", "SE"],
    [15, 35, "bouncer02", "SE"],
    [17, 35, "patron01", "NW", "yo let me in!"],
    [17, 35, "patron02", "NW", "yo let me in!"],
    [17, 35, "patron03", "NW", "yo let me in!"],
    [17, 35, "patron04", "NW", "yo let me in!"],
    [17, 35, "patron05", "NW", "yo let me in!"],
    [17, 35, "patron06", "NW", "yo let me in!"],
    [17, 35, "patron07", "NW", "yo let me in!"],
    [17, 35, "patron08", "NW", "yo let me in!"],
    [17, 35, "patron09", "NW", "yo let me in!"],
    [17, 35, "patron10", "NW", "yo let me in!"],
    [17, 35, "patron11", "NW", "yo let me in!"],
    [17, 35, "patron12", "NW", "yo let me in!"],
    [17, 35, "patron13", "NW", "yo let me in!"],
    [17, 35, "patron14", "NW", "yo let me in!"],
    [17, 35, "patron15", "NW", "yo let me in!"],
    [17, 35, "patron16", "NW", "yo let me in!"],
    [17, 35, "patron17", "NW", "yo let me in!"]
];

// sprites in current level
var levelSprites = [];

// sprite path - bartender walks to start position
var bartenderPath = [
    ["bartender01", "walk", "NW"],
    ["bartender01", "walk", "NW"],
    ["bartender01", "walk", "NW"],
    ["bartender01", "walk", "SW"]
];

// create a DOM element for game object
function newObject(objectName) {
    "use strict";
    
    var levelObject = document.createElement("P");
    
    levelObject.setAttribute("id", objectName);
    levelObject.setAttribute("class",
                             objectName.substring(0, objectName.length - 2) +
                             "-object");
    levelObject.setAttribute("style", "display:none");
    
    document.getElementById("game").appendChild(levelObject);
}

// create a DOM element for game sprite
function newSprite(spriteName) {
    "use strict";
    
    var levelSprite = document.createElement("P");
    
    levelSprite.setAttribute("id", spriteName);
    levelSprite.setAttribute("class", "game-sprite");
    levelSprite.setAttribute("style", "display:none");
    levelSprite.setAttribute("onclick", "speak('" +
                             spriteName + "')");
    
    document.getElementById("game").appendChild(levelSprite);
}

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

// returns a random integer between min and max (including min)
function getRandomInt(min, max) {
    "use strict";
    
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// return index of random sprite in gameSprites that is not in levelSprites
function getSprite() {
    "use strict";
    
    var i, match = true, randomInt = getRandomInt(4, gameSprites.length);
    
    while (match === true) {
        for (i = 0; i < levelSprites.length; i = i + 1) {
            if (levelSprites[i][2] !== gameSprites[randomInt][2]) {
                match = false;
            } else {
                randomInt = getRandomInt(4, gameSprites.length);
            }
        }
    }
    
    return randomInt;
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

// show element by id in cell x y
function showElementInCell(xPos, yPos, elementID, direction) {
    "use strict";
    
    var zlayer, i;
    
    // an elementID must be given to this function
    if (elementID !== undefined) {
        
        // adjust zlayer for entrance sign
        if (elementID === "wallentrance70") {
            zlayer = 43;
        } else if (elementID === "wallcorner56") {
            zlayer = 38;
        } else if (elementID === "wallcornerright38") {
            zlayer = 38;
        } else if (elementID === "wallright39") {
            zlayer = 43;
        } else if (elementID === "bubble-entrance") {
            zlayer = 50;
        
        // zlayer default
        } else {
            zlayer = parseInt(yPos, 10) + 9;
        }
        document.getElementById(elementID).style.zIndex = zlayer.toString();
        
        // set the direction that the element faces (NE, SE, NW, SW)
        if (direction === "NE") {
            document.getElementById(elementID).style.backgroundPositionX =
                "-81vmin";
        } else if (direction === "SE") {
            document.getElementById(elementID).style.backgroundPositionX =
                "-54vmin";
        } else if (direction === "NW") {
            document.getElementById(elementID).style.backgroundPositionX =
                "-27vmin";
        } else {
            document.getElementById(elementID).style.backgroundPositionX =
                "0vmin";
        }
        
        // update levelSprites array
        for (i = 0; i < levelSprites.length; i = i + 1) {
            if (levelSprites[i][2] === elementID) {
                levelSprites[i][0] = xPos;
                levelSprites[i][1] = yPos;
            }
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

// return object in cell
function getElementInCell(cellX, cellY) {
    "use strict";
    
    var i, elementID;
    
    // check for sprites
    for (i = 0; i < levelSprites.length; i = i + 1) {
        if (levelSprites[i][0] === cellX && levelSprites[i][1] === cellY) {
            elementID = levelSprites[i][2];
        }
    }
    
    // no sprites: check for objects (walls etc.)
    if (elementID === undefined) {
        for (i = 0; i < levelObjects.length; i = i + 1) {
            if (levelObjects[i][0] === cellX && levelObjects[i][1] === cellY) {
                elementID = levelObjects[i][2];
            }
        }
    }
    
    // no sprites or objects: return empty
    if (elementID === undefined) {
        return "empty";
        
    // return sprite or onject ID
    } else {
        return elementID;
    }
}

// return random empty cell at the bar or on the dancefloor
function getEmptyCell(area) {
    "use strict";
    
    var i, cell = [], cells = [];
    
    if (area === "bar") {
        cells = [
            [11, 13], [12, 14], [13, 15], [14, 16], [15, 17],
            [16, 18], [17, 19]
        ];
    } else if (area === "dancefloor") {
        cells = [
            [3, 17], [4, 16], [5, 15], [6, 14], [7, 13],
            [4, 18], [5, 17], [6, 16], [7, 15], [8, 14],
            [5, 19], [6, 18], [7, 17], [8, 16], [9, 15],
            [6, 20], [7, 19], [8, 18], [9, 17], [10, 16],
            [7, 21], [8, 20], [9, 19], [10, 18], [11, 17]
        ];
    }
    
    // check coords in cells array for empty positions
    for (i = 0; i < cells.length; i = i + 1) {
        if (getElementInCell(cells[i][0], cells[i][1]) === "empty") {
            cell.push([cells[i][0], cells[i][1]]);
        }
    }
    
    // return random empty cell coords (if any)
    if (cell.length > 0) {
        i = getRandomInt(0, cell.length);
        return cell[i];
    }
}

// return sprite path to destination
function getPath(startX, startY, endX, endY) {
    "use strict";
    
    
}

// get cell number (debug mode function)
function getCell(boardXvmin, boardYvmin) {
    "use strict";
    
    // convert click vmin coordinates into cell x y coordinates
    var i, xPos, yPos, xWidth = 90 / 20, yHeight = 90 / 40;
    
    xPos = (boardXvmin / xWidth).toFixed(0);
    yPos = (boardYvmin / yHeight).toFixed(0);
    
    // if a valid cell was chosen, calculate what to do next
    if (xPos > 0 && xPos < 20 && yPos > 0 && yPos < 40) {
        console.log("selected cell: x" + xPos + ", y" + yPos);
    }
    
    return [parseInt(xPos, 10), parseInt(yPos, 10)];
}

// get click/tap position (debug mode function)
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

// stop animation of element (and removes interval from intervals array)
function animationStop(elementID) {
    "use strict";
    
    var i = animated.indexOf(elementID);
    
    animated.splice(i, 1);
    clearInterval(intervals[i]);
    intervals.splice(i, 1);
}

// start animation of element (and adds interval to intervals array)
function animationStart(elementID, action, direction) {
    "use strict";
    
    // sprite frame reference:
    // walking SW: animationStart(elementID, 2, 0);
    // walking NW: animationStart(elementID, 5, 3);
    // walking SE: animationStart(elementID, 8, 6);
    // walking NE: animationStart(elementID, 11, 9);
    // dancing SW: animationStart(elementID, 17, 12);
    // dancing SE: animationStart(elementID, 23, 18);
    
    var startFrame, frame, endFrame, frameWidth = -9,
        xPos, yPos, xPosInt, yPosInt, cell = [], zlayer;
    
    // determine frame offset
    if (action === "walk") {
        if (direction === "SW") {
            startFrame = 2 * frameWidth;
            endFrame = 0;
        } else if (direction === "NW") {
            startFrame = 5 * frameWidth;
            endFrame = 3 * frameWidth;
        } else if (direction === "SE") {
            startFrame = 8 * frameWidth;
            endFrame = 6 * frameWidth;
        } else if (direction === "NE") {
            startFrame = 11 * frameWidth;
            endFrame = 9 * frameWidth;
        }
    } else if (action === "dance") {
        if (direction === "SW") {
            startFrame = 17 * frameWidth;
            endFrame = 12 * frameWidth;
        } else if (direction === "SE") {
            startFrame = 23 * frameWidth;
            endFrame = 18 * frameWidth;
        }
    }
    
    frame = startFrame;
    
    // get elementID coords
    xPos = document.getElementById(elementID).style.left;
    yPos = document.getElementById(elementID).style.top;
    xPos = xPos.slice(0, -4);
    yPos = yPos.slice(0, -4);
    xPosInt = parseInt(xPos, 10);
    yPosInt = parseInt(yPos, 10);
    cell = getCell(xPosInt, yPosInt);
    
    // begin animation
    animated.push(elementID);
    intervals.push(setInterval(function () {
        
        document.getElementById(elementID).style.backgroundPositionX =
            frame + "vmin";
        
        // move sprite position if walking
        if (action === "walk") {
            
            if (direction === "SW") {
                cell[0] = cell[0] - 0.33;
                cell[1] = cell[1] + 0.33;
            } else if (direction === "NW") {
                cell[0] = cell[0] - 0.33;
                cell[1] = cell[1] - 0.33;
            } else if (direction === "SE") {
                cell[0] = cell[0] + 0.33;
                cell[1] = cell[1] + 0.33;
            } else if (direction === "NE") {
                cell[0] = cell[0] + 0.33;
                cell[1] = cell[1] - 0.33;
            }
            
            xPosInt = (cell[0] * 4.5).toFixed(2);
            yPosInt = (cell[1] * 2.25).toFixed(2);
            
            // update zlayer
            zlayer = parseInt(cell[1], 10) + 13;
            document.getElementById(elementID).style.zIndex =
                zlayer.toString();
            
            // debug mode animation information
            if (getParameter("debug") === "true") {
                console.log(elementID +
                            ": xPosInt = " + xPosInt +
                            ", yPosInt = " + yPosInt +
                            ", zlayer = " + zlayer +
                            ", frame = " + frame);
            }
            
            document.getElementById(elementID).style.left = xPosInt + "vmin";
            document.getElementById(elementID).style.top = yPosInt + "vmin";
        }
        
        // last frame reached
        if (frame === endFrame) {
            
            // loop animation if dancing
            if (action === "dance") {
                frame = startFrame;
                
            // stop animation
            } else {
                animationStop(elementID);
            }
        }
        
        // next frame
        frame = frame - frameWidth;
        
    }, 200));
}

// stop animation of element (and removes interval from intervals array)
function sequenceStop(elementID) {
    "use strict";
    
    var i = paths.indexOf(elementID);
    
    paths.splice(i, 1);
    clearInterval(sequences[i]);
    sequences.splice(i, 1);
}

// execute animations in order
function sequenceStart(sequence) {
    "use strict";
    
    var i = 0;
    
    //begin sequence
    paths.push(sequence[0][0]);
    sequences.push(setInterval(function () {
        if (i < sequence.length) {
            animationStart(sequence[i][0],
                           sequence[i][1],
                           sequence[i][2]);
            i = i + 1;
        } else {
            sequenceStop(sequence[0][0]);
        }
    }, 650));
}

// spawn a new sprite
function spawnSprite(sprite) {
    "use strict";
    
    var i, xPos, yPos, elementID, direction;
    
    xPos = sprite[0];
    yPos = sprite[1];
    elementID = sprite[2];
    direction = sprite[3];
    
    // spawn sprite if cell empty
    if (getElementInCell(xPos, yPos) === "empty") {
        levelSprites.push(sprite);
        newSprite(elementID);
        showElementInCell(xPos, yPos, elementID, direction);
        return true;
        
    // cannot spawn because cell is already occupied
    } else {
        return false;
    }
}

// remove a sprite element from DOM and levelSprites array
function removeSprite(elementID) {
    "use strict";
    
    var i, sprite = document.getElementById(elementID);
    
    sprite.remove();
    
    for (i = 0; i < levelSprites.length; i = i + 1) {
        if (levelSprites[i][2] === elementID) {
            levelSprites.splice(i, 1);
        }
    }
}

// ******************************************************************
// disclaimer functions
// ******************************************************************

function showLogin() {
    "use strict";
    
    hideElement("disclaimer");
    hideElement("register");
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

function showRegister() {
    "use strict";
    
    hideElement("login");
    showElement("register");
}

function showMenu() {
    "use strict";
    
    hideElement("login");
    hideElement("scores");
    hideElement("quit");
    hideElement("bubble-entrance");
    hideElement("bubble-bar");
    hideElement("bubble-dancefloor");
    hideElement("bubble-large");
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

// link a username with email account
function registerUsername(user) {
    "use strict";
    
    var username;

    username = document.getElementById('register-username').value;
    
    user.updateProfile({
        displayName: username
    }).then(function () {
        // username linked to email account
        hideElement("register");
        document.getElementById('register-username').value = "";
        showElement("menu");
    }, function (error) {
        // an error occured.
        console.log(error.message);
    });
}

// register a new email account
function register() {
    "use strict";
    
    var email, password, errorCode, errorMessage, user, username;
    
    email = document.getElementById('register-email').value;
    password = document.getElementById('register-password').value;
    username = document.getElementById('register-username').value;
    
    if (email.length < 10) {
        alert('Please enter a valid email address.');
        document.getElementById("register-email").value = "";
        document.getElementById("register-password").value = "";
        document.getElementById("register-email").focus();
        return;
    } else if (password.length < 8) {
        alert('Please enter a password at least 8 characters in length.');
        document.getElementById("register-password").value = "";
        document.getElementById("register-password").focus();
        return;
    } else if (username.length < 2) {
        alert('Please enter a username at least 2 characters in length.');
        document.getElementById('register-username').value = "";
        document.getElementById("register-username").focus();
        return;
    } else {
        hideElement("register");
    }
    
    // create a new user with a valid email address and password.
    firebase.auth().createUserWithEmailAndPassword(email,
                                                   password).then(function (user) {
        user = firebase.auth().currentUser;
        registerUsername(user);
        document.getElementById('register-email').value = "";
        document.getElementById('register-password').value = "";
        
    }, function (error) {
        // Handle Errors here.
        errorCode = error.code;
        errorMessage = error.message;
        
        if (errorCode === 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
            console.log(error);
        }
        showElement("register");
    });
}

function login() {
    "use strict";
    
    var email = document.getElementById('login-email').value,
        password = document.getElementById('login-password').value;
    
    if (email.length < 10) {
        alert('Please enter a valid email address.');
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
        document.getElementById("login-email").focus();
        return;
    } else if (password.length < 8) {
        alert('Please enter a password at least 8 characters in length.');
        document.getElementById("login-password").value = "";
        document.getElementById("login-password").focus();
        return;
    } else {
        hideElement("login");
    }
    
    // sign out current user
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    
    // sign in with valid email address and password
    firebase.auth().signInWithEmailAndPassword(email,
                                               password).then(function (user) {
         // set text fields to null
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
        showMenu();
        
    }, function (error) {
        // handle errors
        var errorCode, errorMessage;
        errorCode = error.code;
        errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
            console.log(error);
        }
        showElement("login");
    });
}

// if user does not complete registration, remove the email from firebase
// not currently in use
// ********************
/*function deleteUser() {
    "use strict";
    
    var user = firebase.auth().currentUser;
    
    user.delete().then(function () {
    // user deleted.
    }).catch(function (error) {
    // an error happened.
    });
    
    document.getElementById('register-username').value = "";
    showLogin();
}*/
// ********************

// log user out of game
function logOut() {
    "use strict";
    
    firebase.auth().signOut();
    
    hideElement("menu");
    hideElement("register");
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
    }, function (error) {
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
// scoreboard functions
// ******************************************************************

// save score to the firebase database
function saveScore() {
    "use strict";
    var score, ref, user, newRef;
       
    score = levelSprites.length - 4;
    ref = firebase.database().ref();
    newRef = ref.push();
    user = firebase.auth().currentUser;
    
    if (user !== null) {
        newRef.set({
            username: user.displayName,
            score: score
        });
    }
}

// show the top ten scores 
function showScores() {
    "use strict";
    
    var scores, interval, i = 10, check = false,
        ref = firebase.database().ref();
    
    ref.orderByChild("score").limitToLast(10).on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            document.getElementById("pos" + i).innerHTML =
                '#' + i + '  ' + data.val().username + ' (' + data.val().score + ')';
            i = i - 1;
        });
        check = true;
    });
    
    // display loading animation while retrieving from database
    interval = setInterval(function () {
        hideElement("menu");
        showElement("transparency");

        if (check === true) {
            showElement("scores");
            clearInterval(interval);
        }
    }, 1000);
}

function shareScores() {
    "use strict";
    
    alert("URL copied to clipboard (not really!)");
}

// ******************************************************************
// main menu functions
// ******************************************************************

function finishGame() {
    "use strict";
    
    // close game screen
    hideElement("game-controls");
    hideElement("bubble-entrance");
    hideElement("bubble-bar");
    hideElement("bubble-dancefloor");
    hideElement("bubble-large");
    showElement("transparency");
    
    // display score board (DEBUG MODE)
    if (getParameter("debug") === "true") {
        showScores();
    // post score to and display score board
    } else {
        saveScore();
        showScores();
    }
}

function stopTimer() {
    "use strict";
    
    clearInterval(timer);
    timer = undefined;
}

function resetTimer() {
    "use strict";
    
    // set the default round length in minutes and seconds
    if (getParameter("debug") === "true") {
        minutes = 5;
        seconds = 0;
    } else {
        minutes = 5;
        seconds = 0;
    }
}

function startTimer() {
    "use strict";
    
    var min, sec;
    
    if (timer === undefined) {
        timer = setInterval(function () {
            if (minutes === 0 && seconds === 0) {
                stopTimer();
                resetTimer();
                finishGame();
            } else if (minutes > 0 && seconds === 0) {
                seconds = 59;
                minutes = minutes - 1;
            } else {
                seconds = seconds - 1;
            }
            
            if (minutes < 10) {
                min = "0" + minutes.toString();
            } else {
                min = minutes.toString();
            }
            
            if (seconds < 10) {
                sec = "0" + seconds.toString();
            } else {
                sec = seconds.toString();
            }
            
            document.getElementById("game-timer").innerHTML =
                min + ":" + sec;
        }, 1000);
    }
}

function playGame() {
    "use strict";
    
    var i, ii, interval, gameSprite;
    
    hideElement("menu");
    hideElement("transparency");
    
    showElement("game");
    showElement("game-controls");
    
    // clear counter
    clearInterval(counter);
    
    // clear sequences
    while (sequences.length > 0) {
        sequenceStop(paths[0]);
    }
    
    // clear animations
    while (animated.length > 0) {
        animationStop(animated[0]);
    }
    
    // clear sprites
    while (levelSprites.length > 0) {
        removeSprite(levelSprites[0][2]);
    }
    
    // load starting gameSprites
    for (i = 0; i < 4; i = i + 1) {
        spawnSprite(gameSprites[i]);
    }
    
    // set/reset and start game timer
    resetTimer();
    startTimer();
    
    // starting animations
    animationStart("dj01", "dance", "SW");
    sequenceStart(bartenderPath);
    
    // timed animations
    i = 0;
    counter = setInterval(function () {
        i = i + 1;
        
        gameSprite = gameSprites[getSprite()];
        if (spawnSprite(gameSprite) === true) {
            showElementInCell(17.5, 32, "bubble-entrance");
        }
        
        // i = total number spawn attempts
        if (i === 30) {
            clearInterval(counter);
        }
    }, 5000);
}

function hideMenu() {
    "use strict";
    
    hideElement("menu");
    hideElement("register");
    showElement("login");
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
    
    // pause game timer
    stopTimer();
}

function hideQuit() {
    "use strict";
    
    hideElement("transparency");
    hideElement("quit");
    showElement("game-controls");
    
    // resume timer
    startTimer();
}

// this function is triggered when the player clicks on a sprite.
// It will display a random message from the sprite in the
// "bubble-large" element
function speak(elementID) {
    "use strict";
    
    var phrases = [
        "it's going to be a fun night!",
        "i love my job!",
        "wait for the drop...",
        "i've got some real bangers lined up.",
        "stop bothering me!",
        "the glass is half full when i pour it.",
        "when i drink, i can almost remember what happy felt like.",
        "ever wonder why that desperados beer is so tasty?",
        "yes the glasses have been dried thoroughly.",
        "no, i only make these 3 cocktails.",
        "i'm cold.",
        "ID please.",
        "sorry, no cudas.",
        "i don't know any jokes.",
        "no it's not a backpack, i got that wagon on me.",
        "if you can still turn your head, your traps aren't big enough.",
        "when i need calcium, i just rub milk all over my legs.",
        "i am lorde, ya ya ya!",
        "staaaaaan.",
        "i don't have any change!",
        "this is ectoplasm!!",
        "i thought this was america.",
        "oh my god, they took my job!",
        "what seems to be the officer, problem?",
        "found me.",
        "wally or waldo?",
        "where's that dastardly odlaw?",
        "that wizard whitebeard is a hunk!",
        "where's my walking stick?!",
        "no, louis theroux is not my long lost brother.",
        "i'm too sexy for my walking stick.",
        "where is everyone?",
        "tonight i'm going to dance with the devil.",
        "praise desperados!",
        "too old...",
        "why it's a miracle!",
        "tequila + beer = good times.",
        "the thing about the old days: they the old days.",
        "oooooh this is a banger!",
        "freestyler, rock the microphone.",
        "imma bust a move.",
        "say, this is the best beer i've ever had.",
        "did you know desperados beer was first created 20 years ago?",
        "woop woop.",
        "one tequila, two tequila, three tequila, floor...",
        "i know i may look like a real person" +
            ", but i'm not actually a real person.",
        "it's easier to pull the trigger than play the guitar.",
        "you know saragosa? they serve beer...not quite as good as this!",
        "i came here to drink beer and kick ass...and i've finished my beer.",
        "did you see that ludicrous display last night.",
        "the thing about arsenal is they always try to walk it in.",
        "i love this. i feel so social.",
        "if you type 'google' into google, you can break the internet.",
        "mmmmm desperados.",
        "..you do the hokey pokey and turn yourself around...",
        "i would like another alocohol.",
        "man, its so loud in here.",
        "the beastie boys fought and possibly died for my right to party.",
        "all in the game...",
        "i thought kraft punk were playin' tonight.",
        "loud noises!",
        "it's the cold ok!",
        "just blend in like you belong...",
        "i feel so alive!!!",
        "is this a nightmare?",
        "good thing i'm invisible haha.",
        "you all took a life here today. the life of the party.",
        "i'm not superstitious, but i'm a little stitious.",
        "if i can't scuba, then what's this been all about?",
        "do you like fish sticks?",
        "a fire at a sea parks?",
        "99 bottles of desperados on a wall.",
        "desperados time!",
        "no guts, no glory!",
        "i am not impressed by your performance.",
        "ooooh, dance friend.",
        "i'm a barbie girl in a barbie world.",
        "omg the dj is so cute!",
        "disposable cameras seem wasteful " +
            "and you don’t ever get to see your pictures.",
        "this girl was really rude to me at the mall.",
        "i am one of the few people who looks hot eating a cupcake.",
        "why tequila? why not!",
        "created in france...",
        "smooth beer, smooth tunes.",
        "it's party time.",
        "it'sss timmmmeeee",
        "we’re not just here to take part. we’re here to take over.",
        "i keep having vivid dreams of success. then it’s time to sleep.",
        "life's a rollercoaster. You're up, then you're down." +
            "But who doesn't like rollercoasters?",
        "you can call me mystic mac",
        "winners focus on winning. losers focus on winners.",
        "i'm still waiting for the drop...",
        "ahhh! refreshing.",
        "i would have wore a turtle neck, but i'm out of fresh towels.",
        "you don't pick scientology, scientology picks winners.",
        "but when did you get the text?",
        "laaaa laa laaa, wait till i get my money right.",
        "when life gives you lemons, be lebron.",
        "it all just feels so urban.",
        "tequila and beer = tango and cash.",
        "i'm not a business man, i'm a 'business' man."
    ], imageURL = window.getComputedStyle(
        document.getElementById(elementID),
        ''
    ).getPropertyValue('background-image');
    
    document.getElementById("bubble-large-image").style.backgroundImage =
        imageURL;
    
    showElement("bubble-large");
    showElement("bubble-large-ok");
    hideElement("bubble-large-admit");
    hideElement("bubble-large-deny");
    hideElement("bubble-large-serve");
    hideElement("bubble-large-clean");
    hideElement("bubble-large-bounce");
    
    if (elementID === "dj01") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(0, 5)];
    } else if (elementID === "bartender01") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(5, 10)];
    } else if (elementID === "bouncer01") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(10, 14)];
    } else if (elementID === "bouncer02") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(14, 17)];
    } else if (elementID === "patron01") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(17, 24)];
    } else if (elementID === "patron02") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(24, 30)];
    } else if (elementID === "patron03") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(30, 35)];
    } else if (elementID === "patron04") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(35, 40)];
    } else if (elementID === "patron05") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(40, 45)];
    } else if (elementID === "patron06") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(45, 50)];
    } else if (elementID === "patron07") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(50, 55)];
    } else if (elementID === "patron08") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(55, 60)];
    } else if (elementID === "patron09") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(60, 65)];
    } else if (elementID === "patron10") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(65, 70)];
    } else if (elementID === "patron11") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(70, 75)];
    } else if (elementID === "patron12") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(75, 80)];
    } else if (elementID === "patron13") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(80, 85)];
    } else if (elementID === "patron14") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(85, 90)];
    } else if (elementID === "patron15") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(90, 95)];
    } else if (elementID === "patron16") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(95, 100)];
    } else if (elementID === "patron17") {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(100, 105)];
    } else {
        document.getElementById("bubble-large-text").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(35, 70)];
    }
}

// this function is triggered when the player clicks on a speech bubble.
// it will present in-game choices in the "bubble-large" element and
// then move the characters accordingly once a choice is chosen.
function getMove(elementID) {
    "use strict";
    
    var i, spriteID, spriteImageURL, spriteText, cell;
    
    // sprite requesting entry
    if (elementID === "bubble-entrance") {
        spriteID = document.getElementById("game").lastChild.id;
        
        //get and display spriteImage
        spriteImageURL = window.getComputedStyle(
            document.getElementById(spriteID),
            ''
        ).getPropertyValue('background-image');
        document.getElementById("bubble-large-image").style.backgroundImage =
            spriteImageURL;
        
        // get and display spriteText
        for (i = 0; i < levelSprites.length; i = i + 1) {
            if (levelSprites[i][2] === spriteID) {
                spriteText = levelSprites[i][4];
            }
        }
        document.getElementById("bubble-large-text").innerHTML =
            spriteID.substring(0, spriteID.length - 2) +
            ": " + spriteText;
        
        // hide/display options
        showElement("bubble-large");
        hideElement("bubble-large-ok");
        hideElement("bubble-large-serve");
        hideElement("bubble-large-clean");
        showElement("bubble-large-admit");
        showElement("bubble-large-deny");
        
    // sprite entry granted
    } else if (elementID === "bubble-large-admit") {
        spriteID = document.getElementById("game").lastChild.id;
        
        if (getRandomInt(0, 2) === 0) {
            cell = getEmptyCell("bar");
            if (cell !== undefined) {
                showElementInCell(cell[0], cell[1], spriteID, "NE");
                hideElement("bubble-large");
                hideElement("bubble-entrance");
            } else {
                cell = getEmptyCell("dancefloor");
                if (cell !== undefined) {
                    showElementInCell(cell[0], cell[1], spriteID, "NW");
                    
                    if (getRandomInt(0, 2) === 0) {
                        animationStart(spriteID, "dance", "SE");
                    } else {
                        animationStart(spriteID, "dance", "SW");
                    }
                    
                    hideElement("bubble-large");
                    hideElement("bubble-entrance");
                }
            }
        } else {
            cell = getEmptyCell("dancefloor");
            if (cell !== undefined) {
                showElementInCell(cell[0], cell[1], spriteID, "NW");
                
                if (getRandomInt(0, 2) === 0) {
                    animationStart(spriteID, "dance", "SE");
                } else {
                    animationStart(spriteID, "dance", "SW");
                }
                
                hideElement("bubble-large");
                hideElement("bubble-entrance");
            } else {
                cell = getEmptyCell("bar");
                if (cell !== undefined) {
                    showElementInCell(cell[0], cell[1], spriteID, "NE");
                    hideElement("bubble-large");
                    hideElement("bubble-entrance");
                }
            }
        }
        
        // ask for drink
        
    // sprite entry denied
    } else if (elementID === "bubble-large-deny") {
        spriteID = document.getElementById("game").lastChild.id;
        removeSprite(spriteID);
        hideElement("bubble-large");
        hideElement("bubble-entrance");
        
    // sprite requesting a drink
    } else if (elementID === "bubble-bar") {
        console.log("getMove() triggered by " + elementID);
        
    // sprite altercation
    } else if (elementID === "bubble-dancefloor") {
        console.log("getMove() triggered by " + elementID);
        
    // close sprite speak
    } else if (elementID === "bubble-large-ok") {
        hideElement("bubble-large");
        
    // to be determined
    } else {
        console.log("getMove() triggered by " + elementID);
        
    }
}

// ******************************************************************
// initial startup functions
// ******************************************************************

// tab to next input field/submit form when enter is pressed
function formEnter() {
    "use strict";
    
    var loginEmail = document.getElementById("login-email"),
        loginPassword = document.getElementById("login-password"),
        registerEmail = document.getElementById("register-email"),
        registerPassword = document.getElementById("register-password"),
        registerUsername = document.getElementById("register-username");
    
    loginEmail.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("login-password").focus();
        }
    });
    
    loginPassword.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            login();
        }
    });
    
    registerEmail.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("register-password").focus();
        }
    });
    
    registerPassword.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("register-username").focus();
        }
    });
    
    registerUsername.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            register();
        }
    });
}

function start() {
    "use strict";
    
    var i;
    
    formEnter();
    
    // load game objects
    for (i = 0; i < levelObjects.length; i = i + 1) {
        newObject(levelObjects[i][2]);
        showElementInCell(levelObjects[i][0], levelObjects[i][1],
                          levelObjects[i][2]);
    }
    
    if (getParameter("debug") === "true") {
        document.addEventListener("click", getPos, false);
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