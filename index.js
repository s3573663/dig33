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

var score;            // game score (number of patrons in club)

var intervals = [];   // for sprite animation (interval)
var animated = [];    // for sprite animation (elementID)

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
    [15, 11, "bartender01", "SW"],
    [17, 33, "bouncer01", "SE"],
    [15, 35, "bouncer02", "SE"],
    [17, 35, "randy01", "NW", "Desperados", "dance", "social"],
    [17, 35, "wally01", "NW", "Desperados", "dance", "social"],
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
    [3, 11, "dj01", "SE"],
    [15, 13, "bartender01", "SW"],
    [17, 33, "bouncer01", "SE"],
    [15, 35, "bouncer02", "SE"]
];

// sprite currently selected by player
var selectedSprite = [];

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
    // dancing NW: animationStart(elementID, -135, -153);
    // dancing SE: animationStart(elementID, -162, -180);
    // dancing Ne: animationStart(elementID, -189, -198);
    
    var position = parseInt(startIndex, 10);
    
    animated.push(elementID);
    intervals.push(setInterval(function () {
        position = position - startIndex;
        if (position === endIndex) {
            position = startIndex;
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
            console.log(elementID + ": x" + xPos + ", y" + yPos +
                        ", facing " + facing);
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

// get cell number (debug mode function)
function getCell(boardXvmin, boardYvmin) {
    "use strict";
    
    // convert click vmin coordinates into cell x y coordinates
    var i, xPos, yPos, xWidth = 90 / 20, yHeight = 90 / 40;
    
    xPos = (boardXvmin / xWidth).toFixed(0);
    yPos = (boardYvmin / yHeight).toFixed(0);
    
    // if a valid cell was chosen, calculate what to do next
    if (xPos > 0 && xPos < 20 && yPos > 0 && yPos < 40) {
        console.log("click event: x" + xPos + ", y" + yPos);
    }
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

// link a username with email account
function registerUsername(user) {
    "use strict";
    
    var username;

    username = document.getElementById('login-username').value;
    
    user.updateProfile({
        displayName: username
    }).then(function () {
        // username linked to email account
        hideElement("username");
        document.getElementById('login-username').value = "";
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
    username = document.getElementById('login-username').value;
 
    if (email.length < 10) {
        alert('Please enter a valid email address.');
        document.getElementById("register-email").value = "";
        document.getElementById("register-password").value = "";
        return;
    }
    if (password.length < 8) {
        alert('Please enter a password at least 8 characters in length.');
        document.getElementById("register-password").value = "";
        return;
    }
    
    if (username.length < 2) {
        alert('Please enter a username at least 2 characters in length.');
        document.getElementById('login-username').value = "";
        return;
    }
    
    // create a new user with a valid email address and password.
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
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
            showElement("login");
        }
    });
}


function login() {
    "use strict";
    
    // sign out current user
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    
    var email, password;

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
    }
    
    // sign in with valid email address and password
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
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
        }
        console.log(error);
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
    
    document.getElementById('login-username').value = "";
    showLogin();
}*/
// ********************

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
        minutes = 1;
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
    
    hideElement("menu");
    hideElement("transparency");
    
    showElement("game");
    showElement("game-controls");
    
    // set/reset and start game timer
    resetTimer();
    startTimer();
}

function hideMenu() {
    "use strict";
    
    hideElement("menu");
    hideElement("username");
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
        "i mm lorde, ya ya ya!",
        "staaaaaan",
        "i don't have any change! ",
        "this is ectoplasm",
        "i thought this was america",
        "found me",
        "hmmm what is my name again? wally or waldo?",
        "that wizard whitebeard is a hunk",
        "where's my walking stick?!",
        "no, louis theroux is not my long lost brother",
        "",
        "where is everyone?",
        "tequila + beer = good times",
        "say, this is the best beer i've ever had",
        "it's easier to pull the trigger than play the guitar",
        "you know saragosa? they serve beer...not quite as good as this!",
        "i came here to drink beer and kick ass...and i've finished my beer",
        "if you type 'google' into google, you can break the internet",
        "did you see that ludicrous display last night",
        "man, its so loud in here",
        "the thing about arsenal is they always try to walk it in",
        "i love this. i feel so social",
        "the beastie boys fought and possibly died for my right to party",
        "i know i may look like a real person, but i'm not actually a real person",
        "all in the game...",
        "i thought kraft punk were playin' tonight",
        "the thing about the old days: they the old days",
        "loud noises!",
        "mmmmm desperados",
        "did you know desperados beer was first created 20 years ago?",
        "you all took a life here today. the life of the party",
        "i'm not superstitious, but i'm a little stitious",
        "if i can't scuba, then what's this been all about?",
        "do you like fish sticks?",
        "oooooh this is a banger!",
        "freestyler, rock the microphone",
        "a fire at a sea parks?",
        "99 bottles of desperados on a wall",
        "desperados time!",
        "no guts, no glory!",
        "i am not impressed by your performance",
        "ooooh, dance friend",
        "imma bust a move",
        "woop woop",
        "why tequila? why not!",
        "created in france...",
        "smooth beer, smooth tunes",
        "..you do the hokey pokey and turn yourself around...",
        "it's party time",
        "one tequila, two tequila, three tequila, floor..."
    ];
    
    showElement("bubble-large");
    
    if (elementID === "dj01") {
        document.getElementById("bubble-large").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(0, 5)];
    } else if (elementID === "bartender01") {
        document.getElementById("bubble-large").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(5, 10)];
    } else if (elementID === "bouncer01") {
        document.getElementById("bubble-large").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(10, 14)];
    } else if (elementID === "bouncer02") {
        document.getElementById("bubble-large").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(14, 17)];
    } else if (elementID === "randy01") {
        document.getElementById("bubble-large").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(17, 22)];
    } else {
        document.getElementById("bubble-large").innerHTML =
            elementID.substring(0, elementID.length - 2) +
            ": " + phrases[getRandomInt(22, 60)];
    }
}


// ******************************************************************
// initial startup function
// ******************************************************************
function start() {
    "use strict";
    
    var i;
    
    // load game objects
    for (i = 0; i < levelObjects.length; i = i + 1) {
        newObject(levelObjects[i][2]);
        showElementInCell(levelObjects[i][0], levelObjects[i][1],
                          levelObjects[i][2]);
    }
    
    // load sprite objects
    for (i = 0; i < levelSprites.length; i = i + 1) {
        newSprite(levelSprites[i][2]);
        showElementInCell(levelSprites[i][0], levelSprites[i][1],
                          levelSprites[i][2], levelSprites[i][3]);
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