// DIG33 Internet Project Development

// ******************************************************************
// globals and helper functions
// ******************************************************************

var document;          // the web page
var window;            // the browser
var alert;             // browser alert messages
var console;           // browser console (for debug purposes)
var location;          // link address
var firebase;          // google firebase

var timer;             // game timer interval
var minutes;           // game timer (minutes left in game)
var seconds;           // game timer (seconds left in game)
var counter;           // game counter interval

var intervals = [];    // for sprite animation (interval)
var animated = [];     // for sprite animation (elementID)
var sequences = [];    // for sprite animation sequences (interval)
var paths = [];        // for sprite animation sequences (elementID)
var wait = [];         // wait for previous seqence to end (interval)

var levelSprites = []; // sprites in current level
var spriteSelected;    // sprite selected by player click/tap
var score = 0;         // game score (patrons x area x time spawned)
var scoreTimer;        // interval used for score refresh

var gameMusic = document.getElementById("gameMusic");
var introMusic = document.getElementById("introMusic");
var beerSound = document.getElementById("serveSound");
var negSound = document.getElementById("bouncedSound");

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
    [3, 11, "dj01", "SE",
        // entrance
        "na",
        // bar
        "na",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "it's going to be a fun night!",
        "i love my job!",
        "wait for the drop...",
        "i've got some real bangers lined up.",
        "stop bothering me!"],
    [19, 15, "bartender01", "NW",
        // entrance
        "na",
        // bar
        "na",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "the glass is half full when i pour it.",
        "when i drink, i can almost remember what happy felt like.",
        "ever wonder why that desperados beer is so tasty?",
        "yes the glasses have been dried thoroughly.",
        "no, i only make these 3 cocktails."],
    [17, 33, "bouncer01", "SE",
        // entrance
        "na",
        // bar
        "na",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "i'm cold.",
        "ID please.",
        "sorry, no cudas."],
    [15, 35, "bouncer02", "SE",
        // entrance
        "na",
        // bar
        "na",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "i don't know any jokes.",
        "no it's not a backpack, i got that wagon on me.",
        "if you can still turn your head, your traps aren't big enough.",
        "when i need calcium, i just rub milk all over my legs."],
    [17, 35, "randy01", "NW",
        // entrance
        "(born 12/03/1974) says: i am lorde, ya ya ya!",
        // bar
        "desperados original please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "that hit the spot.",
        "i thought this was america.",
        "staaaaaan.",
        "i don't have any change!",
        "this is ectoplasm!!"],
    [17, 35, "john02", "NW",
        // entrance
        "(born 19/07/1987) says: the champ's here.",
        // bar
        "desperados original please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "low calories…nice!",
        "i might tap out.",
        "fitness really changed my life.",
        "i'm not scared of anything.",
        "the higher the risk, the higher the reward."],
    [17, 35, "peter03", "NW",
        // entrance
        "(born 30/12/1959) says: part the doors please.",
        // bar
        "desperados lime please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "tasty citrus flavour!",
        "i need a miracle.",
        "praise desperados!",
        "i'm going to dance with the devil.",
        "the drink of the gods."],
    [17, 35, "paige04", "NW",
        // entrance
        "(born 31/02/1983) says: heyyy, let me in!",
        // bar
        "desperados lime, now!",
        // has a drink
        false,
        // has a problem
        true,
        // speech
        "this is what beer tastes like huh.",
        "i wanna go home.",
        "woop woop.",
        "i love this. i feel so social.",
        "man, its so loud in here."],
    [17, 35, "dwight05", "NW",
        // entrance
        "(born 12/05/1979) says: *hiccup* where am i?",
        // bar
        "got any of that moonshine?",
        // has a drink
        false,
        // has a problem
        true,
        // speech
        "glug glug glug.",
        "you gotta problem?",
        "mmmm beer.",
        "*burp*",
        "whooaa livin on a prayer."],
    [17, 35, "shannon06", "NW",
        // entrance
        "(born 11/12/1992) says: how are you tonight?",
        // bar
        "desperados ginger please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "ginger really adds to the taste.",
        "hmmm I'm bored.",
        "join the desperados revolution!",
        "the beastie boys fought and possibly died for my right to party.",
        "why tequila? why not!"],
    [17, 35, "roy07", "NW",
        // entrance
        "(born 22/04/1998) says: let me flippin in…please.",
        // bar
        "desperados ginger please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "zesty!",
        "ow. four! i mean, five! i mean, fire!",
        "a fire at a sea parks?",
        "i came here to drink beer and kick ass...and i've finished my beer.",
        "did you see that ludicrous display last night?"],
    [17, 35, "tony08", "NW",
        // entrance
        "(born 01/01/1997) says: let me in, it's cold out here!",
        // bar
        "desperados original.",
        // has a drink
        false,
        // has a problem
        true,
        // speech
        "this is the good stuff.",
        "is this a nightmare?",
        "it's the cold ok!",
        "just blend in like you belong...",
        "i feel so alive!!!"],
    [17, 35, "maria09", "NW",
        // entrance
        "(born 16/08/200) says: buenas noches.",
        // bar
        "desperados nocturno por favor.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "muchas gracias.",
        "tengo problema.",
        "tengo sed.",
        "necesito desperados.",
        "taco taco buritto buritto."],
    [17, 35, "kelly10", "NW",
        // entrance
        "(born 23/11/1895) says: hi, i'm 25.",
        // bar
        "one alcohol please",
        // has a drink
        false,
        // has a problem
        true,
        // speech
        "hehe I feel so rebellious.",
        "loud noises!",
        "ooooh, dance friend.",
        "i thought kraft punk were playin' tonight.",
        "omg the dj is so cute!"],
    [17, 35, "dolly11", "NW",
        // entrance
        "(born 12/02/1985) says: grrr i hate waiting in line...",
        // bar
        "desperados red thanks.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "guarana gives me a lift!",
        "i'm giving this experience a zero star rating.",
        "i'm a barbie girl in a barbie world.",
        "i am one of the few people who looks hot eating a cupcake.",
        "ooh this would look good on instagram."],
    [17, 35, "colin12", "NW",
        // entrance
        "(born 07/09/1990) says: you can call me mystic mac.",
        // bar
        "desperados mojito please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "mint.",
        "get off the bus.",
        "we're rich baby!",
        "that's a nice jacket donald",
        "desperados taking over the beer industry."],
    [17, 35, "alberto13", "NW",
        // entrance
        "(born 15/10/2000) says: i'm looking for a fight.",
        // bar
        "*slams bar* gimme a beer",
        // has a drink
        false,
        // has a problem
        true,
        // speech
        "did you just bump into me!",
        "wanna take it outside?",
        "what ya looking at muppet?",
        "everybody was kung fu fighting!",
        "neck up ya parrot."],
    [17, 35, "cedric14", "NW",
        // entrance
        "(born 23/02/1979) says: good evening sir.",
        // bar
        "my good man, might i trouble you for a desperados mojito?",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "my word, this is a refreshing beverage!",
        "pardon me.",
        "created in france…interesting.",
        "you don't pick scientology, scientology picks winners.",
        "this does feel very urban."],
    [17, 35, "waldo15", "NW",
        // entrance
        "(born 01/09/1987) says: you found me.",
        // bar
        "desperados sangre thank you.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "you can taste the spices!",
        "where's my walking stick?!",
        "that wizard whitebeard is a hunk!",
        "don't let that dastardly odlaw inside!",
        "no, louis theroux is not my long lost brother."],
    [17, 35, "zyeasha16", "NW",
        // entrance
        "(born 26/12/1997) says: i'm ready to party!",
        // bar
        "desperados sangre thank you.",
        // has a drink
        false,
        // has a problem
        false,
        // speech
        "there's red grapes in this? wow",
        "na-ah i do what i want.",
        "tequila + beer = good times.",
        "did you know desperados beer was first created 20 years ago?",
        "freestyler, rock the microphone."],
    [17, 35, "pierre17", "NW",
        // entrance
        "(born 21/13/2001) says: bonjour!",
        // bar
        "desperados lime please.",
        // has a drink
        false,
        // has a problem
        true,
        // speech
        "the lime gives it an extra bite.",
        "i would like to speak to your manager.",
        "do you like fish sticks?",
        "one tequila, two tequila, three tequila, floor...",
        "oooooh this is a banger!"],
    [17, 35, "alfred18", "NW,",
        // entrance
        "(born 16/09/2000) says: yo, let me in!",
        // bar
        "desperados mojito please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "damn, desperados is good!",
        "i'm about to leave this joint.",
        "all in the game...",
        "you know saragosa? they serve beer...not quite as good as this!",
        "it's easier to pull the trigger than play the guitar."],
    [17, 35, "odlaw19", "NW",
        // entrance
        "(born 01/09/1987) says: i'll be good, I promise *hehehe*",
        // bar
        "just gimme whatever.",
        // has a drink
        false,
        // has a problem
        true,
        // speech     
        "this is actually pretty good!",
        "drat, i've been stopped again.",
        "i need wally's magic stick.",
        "where is that wally and his impressive stick?",
        "ok ok I will take my hand off his stick."],
    [17, 35, "jennifer20", "NW",
        // entrance
        "(born 25/10/1981) says: *hiccup* what year is it?",
        // bar
        "i would like another alocohol.",
        // has a drink
        false,
        // has a problem
        true,
        // speech     
        "look at the pretty colours.",
        "i need no taxi.",
        "drunk? me no drunk enough.",
        "get outta the way, I need to find a bathroom!",
        "you all took a life here today. the life of the party."],
    [17, 35, "olga21", "NW",
        // entrance
        "(born 17/11/1987) says: hello, may i enter?",
        // bar
        "desperados ginger please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "natural ginger flavours.",
        "i am no kolechian spy!",
        "glory to arstotzka!",
        "if you type 'google' into google, you can break the internet.",
        "why don't they try mixing beer and vodka?"],
    [17, 35, "billy22", "NW",
        // entrance
        "(born 16/12/1996) says: let me in, let me in.",
        // bar
        "desperados red thanks.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "this will give me wings!",
        "don't you know who i am!",
        "i'm the bad guy, duh.",
        "if i can't scuba, then what's this been all about?",
        "desperados time!"],
    [17, 35, "omar23", "NW",
        // entrance
        "(born 29/02/2000) says: how do you do?",
        // bar
        "desperados mojito please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "yum yum, desperados A+.",
        "i demand a refund!",
        "real men wear pink.",
        "the thing about the old days: they the old days.",
        "drop the bass."],
    [17, 35, "mike24", "NW",
        // entrance
        "(born 29/02/1999) says: hi, I'm date mike.",
        // bar
        "desperados original please.",
        // has a drink
        false,
        // has a problem
        true,
        // speech     
        "smooth beer.",
        "you can't talk to me that way!",
        "nice to meet me.",
        "how do you like your eggs in the morning?",
        "let me do my thang."],
    [17, 35, "lance25", "NW",
        // entrance
        "(born 14/01/1994) says: mi casa su casa.",
        // bar
        "desperados sangre thank you.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "this combo is a winner.",
        "quit talking to me.",
        "hey, whattya think about trudi?",
        "well, I ain't givin' her the shot! ",
        "don vincenzo. step into my office?"],
    [17, 35, "julian26", "NW",
        // entrance
        "(born 23/06/1977) says: how you people doin'?",
        // bar
        "desperados nocturno please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "mmmm this is a tasty beverage.",
        "say what again, I dare you.",
        "a royale with cheese!",
        "you mind if I have some of your tasty beverage?",
        "this is some gourmet beer."],
    [17, 35, "amanda27", "NW",
        // entrance
        "(born 14/05/2001) says: heyyy, let me in!",
        // bar
        "desperados original please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "desperados are so creative!",
        "worst night ever!",
        "smooth beer, smooth tunes.",
        "would have wore a turtle neck, but i'm out of fresh towels.",
        "this girl was really rude to me at the mall."],
    [17, 35, "heather28", "NW",
        // entrance
        "(born 11/11/1989) says: hello, may i enter?",
        // bar
        "desperados red thanks.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "can I get a 6-pack to takeaway?",
        "i am not impressed by your performance.",
        "why tequila? why not!",
        "i'm not superstitious, but i'm a little stitious.",
        "laaaa laa laaa, wait till i get my money right."],
    [17, 35, "ernesto29", "NW",
        // entrance
        "(born 24/07/1968) says: i'm ready to party!",
        // bar
        "desperados ginger please.",
        // has a drink
        false,
        // has a problem
        false,
        // speech     
        "better than my homebrew.",
        "bring back the disco.",
        "no guts, no glory!",
        "..you do the hokey pokey and turn yourself around...",
        "tequila and beer = tango and cash."],
    [17, 35, "kyle30", "NW",
        // entrance
        "(born 03/00/1999) says: yo, let me in!",
        // bar
        "desperados lime please.",
        // has a drink
        false,
        // has a problem
        true,
        // speech     
        "i like lime.",
        "i could be drinking in my shed.",
        "it'sss timmmmeeee",
        "the thing about arsenal is they always try to walk it in.",
        "when life gives you lemons, be lebron."]
];

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
    levelSprite.setAttribute("onclick", "getMove('" +
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
        } else if (elementID === "bubble-alert") {
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
            [7, 21], [8, 20], [9, 19], [10, 18], [11, 17],
            [8, 22], [9, 21], [10, 20], [11, 19], [12, 18]
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

// return index of random sprite in gameSprites that is not in levelSprites
function getRandomGameSprite() {
    "use strict";
    
    var i, randomInt = getRandomInt(4, gameSprites.length);
    
    for (i = 0; i < levelSprites.length; i = i + 1) {
        if (levelSprites[i][2] === gameSprites[randomInt][2]) {
            randomInt = getRandomInt(4, gameSprites.length);
            i = 0;
        }
    }
    
    return randomInt;
}

// returns the area in which a sprite is located (entrance/bar/dancefloor)
function getSpriteLocation(elementID) {
    "use strict";
    
    var i, cell, cells = [
        // entrance
        [17, 35],
        //bar
        [11, 13], [12, 14], [13, 15], [14, 16], [15, 17],
        [16, 18], [17, 19],
        // dancefloor
        [3, 17], [4, 16], [5, 15], [6, 14], [7, 13],
        [4, 18], [5, 17], [6, 16], [7, 15], [8, 14],
        [5, 19], [6, 18], [7, 17], [8, 16], [9, 15],
        [6, 20], [7, 19], [8, 18], [9, 17], [10, 16],
        [7, 21], [8, 20], [9, 19], [10, 18], [11, 17],
        [8, 22], [9, 21], [10, 20], [11, 19], [12, 18]
    ];
    
    for (i = 0; i < levelSprites.length; i = i + 1) {
        if (levelSprites[i][2] === elementID) {
            for (cell = 0; cell < cells.length; cell = cell + 1) {
                if (cells[cell][0] === levelSprites[i][0] &&
                        cells[cell][1] === levelSprites[i][1]) {
                    
                    if (cell === 0) {
                        return "entrance";
                    } else if (cell > 0 && cell < 8) {
                        return "bar";
                    } else if (cell > 7 && cell < cells.length) {
                        return "dancefloor";
                    } else {
                        console.log("getSpriteLocation(elementID): " +
                                    elementID + " is out of bounds");
                        return false;
                    }
                }
            }
            
            // sprite must be staff
            return "staff";
        }
    }
}

// return sprite text field (entry/bar/speak)
function getSpriteText(elementID, textType) {
    "use strict";
    
    var i, field;
    
    for (i = 0; i < levelSprites.length; i = i + 1) {
        if (levelSprites[i][2] === elementID) {
            
            if (textType === "entry") {
                return levelSprites[i][4];
            } else if (textType === "bar") {
                return levelSprites[i][5];
            } else {
                field = getRandomInt(8, levelSprites[i].length);
                return levelSprites[i][field];
            }
        }
    }
}

// get cell number (debug mode function)
function getCell(boardXvmin, boardYvmin) {
    "use strict";
    
    // convert click vmin coordinates into cell x y coordinates
    var i, xPos, yPos, xWidth = 90 / 20, yHeight = 90 / 40;
    
    xPos = (boardXvmin / xWidth).toFixed(0);
    yPos = (boardYvmin / yHeight).toFixed(0);
    
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
        boardYvmin, // click y position in viewport min units on game board
        cell;       // cell x y
    
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
    cell = getCell(boardXvmin, boardYvmin);
    
    // if a valid cell was chosen, display cell in console
    if (cell[0] > 0 && cell[0] < 20 && cell[1] > 0 && cell[1] < 40) {
        console.log("selected cell: x" + cell[0] + ", y" + cell[1]);
    }
}

// stop animation of element (and removes interval from intervals array)
function animationStop(elementID) {
    "use strict";
    
    var i;
    
    while (animated.indexOf(elementID) !== -1) {
        i = animated.indexOf(elementID);
        animated.splice(i, 1);
        clearInterval(intervals[i]);
        intervals.splice(i, 1);
    }
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
    
    var i, startFrame, frame, endFrame, frameWidth = -9,
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
        
        if (document.getElementById(elementID) !== null) {
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
        }
    }, 200));
}

// stop animation of element (and removes interval from intervals array)
function sequenceStop(elementID) {
    "use strict";
    
    var i;
    
    while (paths.indexOf(elementID) !== -1) {
        i = paths.indexOf(elementID);
        paths.splice(i, 1);
        clearInterval(sequences[i]);
        sequences.splice(i, 1);
    }
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
    
    var xPos, yPos, elementID, direction;
    
    xPos = Number(sprite[0]);
    yPos = Number(sprite[1]);
    elementID = sprite[2];
    direction = sprite[3];
    
    // PATCH - DO NOT REMOVE
    if (levelSprites.length > 4 && xPos !== 17 && yPos !== 35) {
        xPos = 17;
        yPos = 35;
    }
    
    // spawn sprite if cell empty
    if (getElementInCell(xPos, yPos) === "empty") {
        levelSprites.push(sprite);
        
        // PATCH - DO NOT REMOVE
        levelSprites[levelSprites.length - 1][6] = Boolean(false);
        
        newSprite(elementID);
        showElementInCell(xPos, yPos, elementID, direction);
        
        if (getSpriteLocation(elementID) === "entrance") {
            showElementInCell(17.5, 32, "bubble-alert");
        }
        
        return true;
        
    // cannot spawn because cell is already occupied
    } else {
        return false;
    }
}

// remove a sprite element from DOM and levelSprites array
function removeSprite(elementID) {
    "use strict";
    
    var i, sprite = document.getElementById(elementID),
        startX, startY, startDirection;
    
    // stop animations
    sequenceStop(elementID);
    animationStop(elementID);
    
    // reset sprite to default starting position/direction
    for (i = 0; i < gameSprites.length; i = i + 1) {
        if (elementID === gameSprites[i][2]) {
            startX = gameSprites[i][0];
            startY = gameSprites[i][1];
            startDirection = gameSprites[i][3];
        }
    }
    showElementInCell(startX, startY, elementID, startDirection);
    
    // remove sprite element
    sprite.remove();
    
    // clear levelSprites array
    for (i = 0; i < levelSprites.length; i = i + 1) {
        if (levelSprites[i][2] === elementID) {
            levelSprites.splice(i, 1);
        }
    }
}

// walk sprite along calculated path to destination
function walkPath(elementID, area, startCell, cell) {
    "use strict";
    
    var i, randomInt, path = [], click, cells = [
        // entrance
        [17, 35],
        //bar
        [11, 13], [12, 14], [13, 15], [14, 16], [15, 17],
        [16, 18], [17, 19],
        // dancefloor
        [3, 17], [4, 16], [5, 15], [6, 14], [7, 13],
        [4, 18], [5, 17], [6, 16], [7, 15], [8, 14],
        [5, 19], [6, 18], [7, 17], [8, 16], [9, 15],
        [6, 20], [7, 19], [8, 18], [9, 17], [10, 16],
        [7, 21], [8, 20], [9, 19], [10, 18], [11, 17]
    ];
    
    if (area === "bar") {
        
        // NW 7 cells
        for (i = 0; i < 8; i = i + 1) {
            path.push([elementID, "walk", "NW"]);
        }
        
        // NE 7 cells
        for (i = 0; i < 7; i = i + 1) {
            path.push([elementID, "walk", "NE"]);
        }
        
        // NW n cells
        for (i = 7; i > 0; i = i - 1) {
            if (cell !== cells[i][0] && cell[1] !== cells[i][1]) {
                path.push([elementID, "walk", "NW"]);
            } else {
                i = 0;
            }
        }
        
        // NE 1 cell
        path.push([elementID, "walk", "NE"]);
        
        // disable click while walking
        click = document.getElementById(elementID).onclick;
        document.getElementById(elementID).onclick = "";
        wait.push(setTimeout(function () {
            document.getElementById(elementID).onclick = click;
        }, path.length * 700));
        
        sequenceStart(path);
        
    } else if (area === "dancefloor") {
        
        // SW 1 cell
        path.push([elementID, "walk", "SW"]);
        startCell[0] = Number(startCell[0]) - 1;
        startCell[1] = Number(startCell[1]) + 1;
        
        while (startCell[0] !== 10 && startCell[1] !== 14) {
            path.push([elementID, "walk", "NW"]);
            startCell[0] = startCell[0] - 1;
            startCell[1] = startCell[1] - 1;
        }
        
        path.push([elementID, "walk", "SW"]);
        startCell[0] = startCell[0] - 1;
        startCell[1] = startCell[1] + 1;
        
        // disable click while walking
        click = document.getElementById(elementID).onclick;
        document.getElementById(elementID).onclick = "";
        wait.push(setTimeout(function () {
            document.getElementById(elementID).onclick = click;
        }, path.length * 700));
        
        sequenceStart(path);
        
        i = setInterval(function () {
            if (paths.indexOf(elementID) === -1 &&
                    document.getElementById(elementID) !== null) {
                showElementInCell(cell[0], cell[1], elementID, "SW");
            
                // start dancing
                randomInt = getRandomInt(0, 2);
                if (randomInt === 0) {
                    animationStart(elementID, "dance", "SW");
                } else {
                    animationStart(elementID, "dance", "SE");
                }
                
                clearInterval(i);
            }
        }, 1000);
    }
}

// ******************************************************************
// audio functions
// ******************************************************************

function playMusic() {
    "use strict";
    
    introMusic.pause();
    
    if (getParameter("debug") === undefined) {
        gameMusic.currentTime = 0;
        gameMusic.play();
        gameMusic.volume = 0.1;
    }
}

function pauseMusic() {
    "use strict";
    
    gameMusic.pause();
}

function resumeMusic() {
    "use strict";
    
    gameMusic.play();
}

function playIntro() {
    "use strict";
    
    introMusic.currentTime = 0;
    introMusic.loop = true;
    introMusic.volume = 0.3;
    introMusic.play();
}

function pauseIntro() {
    "use strict";
    
    introMusic.pause();
}

function playSound(sound) {
    "use strict";
    
    sound.play();
}

function soundOnOff(audioControl) {
    "use strict";
    
    // switch audio image
    audioControl.src =
        audioControl.bool ? "images/audio.png" : "images/mute.png";
    audioControl.bool = !audioControl.bool;
    
    // either mute or un-mute audio
    if (audioControl.bool === true) {
        introMusic.muted = true;
    } else {
        introMusic.muted = false;
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

// display player registration menu
function showRegister() {
    "use strict";
    
    hideElement("login");
    showElement("register");
}

// display main menu
function showMenu() {
    "use strict";
    
    playIntro();
    
    hideElement("login");
    hideElement("scores");
    hideElement("quit");
    hideElement("bubble-alert");
    hideElement("bubble-large");
    showElement("transparency");
    showElement("menu");
}

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
        showMenu();
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
    firebase.auth(
    ).createUserWithEmailAndPassword(email, password).then(function (user) {
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

// player login
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

// player logout
function logOut() {
    "use strict";
    
    firebase.auth().signOut();
    pauseIntro();
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
    var ref, user, newRef;
    
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
    
    var scores, interval, user, i = 10, check = false,
        ref = firebase.database().ref();
    
    user = firebase.auth().currentUser;
    
    ref.orderByChild("score").limitToLast(10).on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            if (user) {
                // bold the current user high scores
                if (user.displayName === data.val().username) {
                    document.getElementById("pos" + i).innerHTML =
                        '#' + i + '  ' + '<b>' + data.val().username +
                        '</b>' + ' (' + data.val().score + ')';
                    i = i - 1;
                } else {
                    document.getElementById("pos" + i).innerHTML =
                        '#' + i + '  ' + data.val().username +
                        ' (' + data.val().score + ')';
                    i = i - 1;
                }
            } else {
                document.getElementById("pos" + i).innerHTML =
                        '#' + i + '  ' + data.val().username +
                        ' (' + data.val().score + ')';
                i = i - 1;
            }
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

// copy link for the game scoreboard to clipboard
function shareScores() {
    "use strict";
    var link, textArea;
    
    link = window.location.href + "?scores=true";
    
    textArea = document.createElement("textarea");
    document.body.appendChild(textArea);
    textArea.value = link;
    textArea.select();
    document.execCommand("copy");
    alert("URL copied to clipboard " + textArea.value);
    document.body.removeChild(textArea);
    
    alert("URL copied to clipboard");
}

// reset user score
function stopScore() {
    "use strict";
    
    clearInterval(scoreTimer);
    scoreTimer = undefined;
}

// pause user score accural
function resetScore() {
    "use strict";
    
    score = 0;
}

// calculate and display user score (total sprites x area x time spawned)
function startScore() {
    "use strict";
    
    var i, scoreStart;
    
    if (scoreTimer === undefined) {
        scoreTimer = setInterval(function () {
            
            scoreStart = score;
            
            for (i = 0; i < levelSprites.length; i = i + 1) {
                
                // sprite at bar: + 100 points per second
                if (getSpriteLocation(levelSprites[i][2]) === "bar") {
                    
                    score = score + 100;
                    
                // sprite at bar: good = + 500 points per second
                //                bad = - 1000 points per second
                } else if (getSpriteLocation(levelSprites[i][2]) ===
                           "dancefloor") {
                    
                    // is good
                    if (levelSprites[i][7] === false) {
                        score = score + 500;
                        
                    // is bad
                    } else {
                        score = score - 1000;
                    }
                }
                
                // change score colour ('+' = white, '-' = red)
                if (score > scoreStart || score === scoreStart) {
                    
                    // score increasing
                    document.getElementById("game-score").style.color =
                        "white";
                    
                } else {
                    
                    // score decreasing
                    document.getElementById("game-score").style.color =
                        "red";
                }
                
                document.getElementById("game-score").innerHTML = score;
            }
        }, 1000);
    }
}

// ******************************************************************
// main menu functions
// ******************************************************************

function finishGame() {
    "use strict";
    
    stopScore();
    
    // close game screen
    hideElement("game-controls");
    hideElement("bubble-alert");
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
    
    //clear then calculate game score
    resetScore();
    startScore();
    
    // start playing game music
    playMusic();
    
    // starting animations
    animationStart("dj01", "dance", "SW");
    sequenceStart(bartenderPath);
    
    // spawn sprites ( 5 seconds apart if room at bar)
    i = 0;
    counter = setInterval(function () {
        i = i + 1;
        
        gameSprite = gameSprites[getRandomGameSprite()];
        
        // REMOVE
        console.log(gameSprite[2] + " x = " + gameSprite[0] +
                    " y = " + gameSprite[1]);
        
        if (getEmptyCell("bar") !== undefined) {
            spawnSprite(gameSprite);
        }
        
        // i = total number spawn attempts
        if (i === 30) {
            clearInterval(counter);
        }
    }, 10000);
}

// display login menu
function hideMenu() {
    "use strict";
    
    hideElement("menu");
    hideElement("register");
    showElement("login");
}

// ******************************************************************
// game functions
// ******************************************************************

// display quit game menu
function showQuit() {
    "use strict";
    
    hideElement("game-controls");
    hideElement("bubble-large");
    showElement("transparency");
    showElement("quit");
    
    // pause game-timer
    stopTimer();
    // pause game-score
    stopScore();
    // pause game music
    pauseMusic();
}

// hide quit game menu
function hideQuit() {
    "use strict";
    
    hideElement("transparency");
    hideElement("quit");
    showElement("game-controls");
    
    // resume game-timer
    startTimer();
    // resume game-score
    startScore();
    // resume playing music
    resumeMusic();
}

// this function is triggered when the player clicks on a sprite.
// it will present in-game choices in the "bubble-large" element and
// then move the characters accordingly once a choice is chosen. if
// no moves are possible, it will display a random message.
function getMove(elementID) {
    "use strict";
    
    var i, spriteID, spriteImageURL, spriteText, spriteLocation,
        cell, startCell = [0, 0];
    
    // get sprites current location (entrance/bar/dancefloor)
    spriteLocation = getSpriteLocation(elementID);
    
    // sprite name (without id number)
    spriteID = elementID.substring(0, elementID.length - 2);
    
    // get and display spriteImage
    spriteImageURL = window.getComputedStyle(
        document.getElementById(elementID),
        ''
    ).getPropertyValue('background-image');
    document.getElementById("bubble-large-image").style.backgroundImage =
        spriteImageURL;
    
    // entry granted
    if (elementID === "bubble-large-admit") {
        
        elementID = spriteSelected;
        cell = getEmptyCell("bar");
        
        // update sprite coords
        for (i = 0; i < levelSprites.length; i = i + 1) {
            if (levelSprites[i][2] === elementID) {
                startCell[0] = levelSprites[i][0];
                startCell[1] = levelSprites[i][1];
                levelSprites[i][0] = cell[0];
                levelSprites[i][1] = cell[1];
            }
        }
        
        if (cell !== undefined) {
            walkPath(elementID, "bar", startCell, cell);
            hideElement("bubble-large");
            hideElement("bubble-alert");
        }
        
    // entry denied
    } else if (elementID === "bubble-large-deny") {
        
        elementID = spriteSelected;
        removeSprite(elementID);
        
        hideElement("bubble-large");
        hideElement("bubble-alert");
        playSound(negSound);
        
    // serve drink
    } else if (elementID === "bubble-large-serve") {
        
        elementID = spriteSelected;
        
        cell = getEmptyCell("dancefloor");
        
        // update sprite coords
        for (i = 0; i < levelSprites.length; i = i + 1) {
            if (levelSprites[i][2] === elementID) {
                startCell[0] = levelSprites[i][0];
                startCell[1] = levelSprites[i][1];
                levelSprites[i][0] = cell[0];
                levelSprites[i][1] = cell[1];
                
                // assign drink to sprite
                levelSprites[i][6] = true;
            }
        }
        
        if (cell !== undefined) {
            walkPath(elementID, "dancefloor", startCell, cell);
            hideElement("bubble-large");
            playSound(beerSound);
        }
        
        // bug fix - game timer would stop when drink was served
        stopTimer();
        startTimer();
        
    // bounce sprite
    } else if (elementID === "bubble-large-bounce") {
        elementID = spriteSelected;
        removeSprite(elementID);
        hideElement("bubble-large");
        playSound(negSound);
        
    // close speech window
    } else if (elementID === "bubble-large-ok") {
        hideElement("bubble-large");
        
    // sprite is staff
    } else if (spriteLocation === "staff") {
        
        // random speak
        document.getElementById("bubble-large-text").innerHTML =
            spriteID + ": " + getSpriteText(elementID);
        
        // hide/display options
        showElement("bubble-large");
        showElement("bubble-large-ok");
        hideElement("bubble-large-admit");
        hideElement("bubble-large-deny");
        hideElement("bubble-large-serve");
        hideElement("bubble-large-bounce");
    
    // sprite at entrance
    } else if (spriteLocation === "entrance") {
        
        spriteSelected = elementID;
        
        // show id
        document.getElementById("bubble-large-text").innerHTML =
            spriteID + ": " + getSpriteText(elementID, "entry");
        
        // hide/display options
        showElement("bubble-large");
        hideElement("bubble-large-ok");
        showElement("bubble-large-admit");
        showElement("bubble-large-deny");
        hideElement("bubble-large-serve");
        hideElement("bubble-large-bounce");
        
    // sprite at bar
    } else if (spriteLocation === "bar") {
        
        spriteSelected = elementID;
        
        for (i = 0; i < levelSprites.length; i = i + 1) {
            if (levelSprites[i][2] === elementID) {
                
                // no drink
                if (levelSprites[i][6] === false) {
                    
                    // order a drink
                    document.getElementById("bubble-large-text").innerHTML =
                        spriteID + ": " + getSpriteText(elementID, "bar");
            
                    // hide/display options
                    showElement("bubble-large");
                    hideElement("bubble-large-ok");
                    hideElement("bubble-large-admit");
                    hideElement("bubble-large-deny");
                    showElement("bubble-large-serve");
                    showElement("bubble-large-bounce");
                    
                // has drink
                } else {
                    
                    // random speak
                    document.getElementById("bubble-large-text").innerHTML =
                        spriteID + ": " + getSpriteText(elementID);
                    
                    // hide/display options
                    showElement("bubble-large");
                    showElement("bubble-large-ok");
                    hideElement("bubble-large-admit");
                    hideElement("bubble-large-deny");
                    hideElement("bubble-large-serve");
                    hideElement("bubble-large-bounce");
                }
            }
        }
        
    // sprite on dancefloor
    } else if (spriteLocation === "dancefloor") {
        
        spriteSelected = elementID;
        
        for (i = 0; i < levelSprites.length; i = i + 1) {
            if (levelSprites[i][2] === elementID) {
                
                // random speak
                document.getElementById("bubble-large-text").innerHTML =
                    spriteID + ": " + getSpriteText(elementID);
                    
                // hide/display options
                showElement("bubble-large");
                showElement("bubble-large-ok");
                hideElement("bubble-large-admit");
                hideElement("bubble-large-deny");
                hideElement("bubble-large-serve");
                showElement("bubble-large-bounce");
            }
        }
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

// first function called when site loads
function start() {
    "use strict";
    
    var i, removeShare, removeMenu;
    
    formEnter();
    document.addEventListener("click", getPos, false);
    
    // load game objects
    for (i = 0; i < levelObjects.length; i = i + 1) {
        newObject(levelObjects[i][2]);
        showElementInCell(levelObjects[i][0], levelObjects[i][1],
                          levelObjects[i][2]);
    }
    
    // start in debug mode (skips all menus)
    if (getParameter("debug") === "true") {
        hideElement("hide");
        hideElement("disclaimer");
        playGame();
        
    // skip to high scores (cannot return to main menu)
    } else if (getParameter("scores") === "true") {
        hideElement("hide");
        hideElement("disclaimer");
        removeMenu = document.getElementById("menuBtn");
        removeShare = document.getElementById("shareBtn");
        removeMenu.parentNode.removeChild(removeMenu);
        removeShare.parentNode.removeChild(removeShare);
        showScores();
        
    // normal startup (no parameters given)
    } else {
        hideElement("game-controls");
        showElement("transparency");
        hideElement("hide");
        showElement("disclaimer");
    }
}