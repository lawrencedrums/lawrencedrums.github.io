let arraySize = 100
let canvas = document.getElementById('mainCanvas');
let c = canvas.getContext('2d');

// Make canvas as large as the user's screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function getNewArr() {
    // Poplate an array of 1 to arraySize
    let array = [];
    for(let i = 1; i <= arraySize; i++) {
        array.push(i);
    }

    shuffle(array);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < arraySize; i++) { 
        drawArr(i, array); 
    }
}

// Create rectangles with colour and length based the number size in array
// Each with a set time delay
function drawArr(i, array) {
    setTimeout(function() {
        c.fillStyle = getHSL(array[i]);
        let rect = getPos(i, array[i]);
        c.fillRect(rect.x, rect.y, rect.width, rect.height);
    }, 3 * i);
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}

// Find HSL Hue value based on number size in array
function getHSL(i) {
    if (i === 0 || i === arraySize) {
        return "hsl(0, 100%, 50%)";
    }
    else {
        let hue = 360 / arraySize * i;
        return "hsl(" + hue + ", 100%, 50%)";
    }
}

// Find the position of where each rectangle should start
function getPos(i, num) {
    let rectangle = {
        x: 10 + i * (canvas.width - 20) / arraySize,
        y: canvas.height - 10,
        width: (canvas.width - 20) / arraySize - 4,
        height: ((canvas.height - 50) / arraySize) * -num
    };
    return rectangle;
}