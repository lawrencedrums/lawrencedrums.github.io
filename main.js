let array, arraySize, canvas, ctx, delayTime, rect, num;

function init() {
    arraySize = 100;
    // delayTime = 10;
    canvas = document.getElementById('mainCanvas');
    ctx = canvas.getContext('2d');

    // Make canvas as large as the user's screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Populate new array
    array = [];
    for(let i = 1; i <= arraySize; i++) {
        array.push(i);
    }

    randomArr();
}

function randomArr() {
    //disableButtons(delayTime * arraySize);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shuffle(array);

    // Draw new array each a delay between each rectangle
    //setTimeout(() => {
    drawArr(array); 
    //}, delayTime * i);
}

// Create each rectangles with colour and length based on the number size in array
function drawArr(array) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < arraySize; i++) { 
        ctx.fillStyle = getHSL(array[i]);
        rect = getPos(i, array[i]);
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
}

async function bubbleSort() {
    let n, i, j;
    let end = arraySize;

    document.getElementById("randombtn").disabled = true;
    document.getElementById("sortbtn").disabled = true;

    for (n = 0; n < end; end--) {
        for (i = 0, j = 1; i < arraySize; i++, j++) {
            if (array[i] > array[j]) {
                await swap(array, i, j);
            }
            drawArr(array, i);
        }
    }
    document.getElementById("randombtn").disabled = false;
    document.getElementById("sortbtn").disabled = false;
}

async function swap(array, x, y) {
    await sleep(5);
    let temp = array[x];
    array[x] = array[y];
    array[y] = temp;
}

// Resolve a promise after a set-time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Disable and re-enable buttons after a set-time delay
// function disableButtons(time) {
//     document.getElementById("randombtn").disabled = true;
//     document.getElementById("sortbtn").disabled = true;

//     setTimeout(() => {
//         document.getElementById("randombtn").disabled = false;
//         document.getElementById("sortbtn").disabled = false;
//     }, time);
// }

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
        x: 20 + i * (canvas.width - 40) / arraySize,
        y: canvas.height - 20,
        width: (canvas.width - 20) / arraySize - 4,
        height: ((canvas.height - 40) / arraySize) * -num
    };
    return rectangle;
}