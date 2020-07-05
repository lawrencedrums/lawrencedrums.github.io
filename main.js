let array, canvas, ctx, rect, num;
let arraySize = 100;
let delayTime = 8;

function init() {
    disableButtons();
    canvas = document.getElementById('mainCanvas');
    ctx = canvas.getContext('2d');

    // Make canvas as large as the user's screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Populate new array
    array = [];
    for (let i = 1; i <= arraySize; i++) {
        array.push(i);
    }

    drawArr(array);

    // Randomize after a set delay
    setTimeout(() => {
        randomizeArray(array);
    }, 1000);
}

async function randomizeArray() {
    disableButtons();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await prettierShuffle(array);
    enableButtons();
}

// Draw rectangles in array instantly. Colour rectangle black if that number is being sorted.
function drawArr(array, beingSorted) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < arraySize; i++) { 

        if (i == beingSorted) {
            ctx.fillStyle = "hsl(0, 0%, 0%)";
        } else {
            ctx.fillStyle = getHSL(array[i]);
        }
        rect = getPos(i, array[i]);
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
}

async function bubbleSort() {
    let n, i, j;
    let end = arraySize;
    disableButtons();

    for (n = 0; n < end; end--) {
        for (i = 0, j = 1; i < arraySize; i++, j++) {
            if (array[i] > array[j]) {
                await swap(array, i, j);
                drawArr(array, j);
            }
        }
    }
    drawArr(array, j);
    enableButtons();
}

async function insertionSort() {
    let key, i, j;
    disableButtons();

    for (i = 1; i < arraySize; i++) {
        key = array[i];
        j = i - 1;

        while (j >= 0 && array[j] > key) {
            await sleep(delayTime);
            array[j + 1] = array[j];
            drawArr(array, j);
            j--;
        }
        array[j + 1] = key;
    }
    drawArr(array);
    enableButtons();
}

async function swap(array, x, y) {
    await sleep(delayTime);
    let temp = array[x];
    array[x] = array[y];
    array[y] = temp;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function disableButtons() {
    document.getElementById("randombtn").disabled = true;
    document.getElementById("sorts").disabled = true;
}

function enableButtons() {
    document.getElementById("randombtn").disabled = false;
    document.getElementById("sorts").disabled = false;
}

// A shuffle that looks prettier and more "random"
async function prettierShuffle(array) {
    let shuffledNumber = [], randomIndex, randomIndexTwo;

    // As long as there's unshuffled index left...
    while (shuffledNumber.length !== arraySize) {

        // Randomly get 2 indices
        randomIndex = Math.floor(Math.random() * arraySize);
        randomIndexTwo = Math.floor(Math.random() * arraySize);

        // If the random indices are different...
        if (randomIndex !== randomIndexTwo && 

            // And indices are not shuffled...
            shuffledNumber.includes(randomIndex) == false && shuffledNumber.includes(randomIndexTwo) == false) {

            // Swap them and push them into shuffled list of numbers
            await swap(array, randomIndex, randomIndexTwo);
            shuffledNumber.push(randomIndex, randomIndexTwo)
            drawArr(array);
        }
    }
}

// Calculate HSL Hue value based on number size in array
function getHSL(i) {
    if (i === 0 || i === arraySize) {
        return "hsl(0, 100%, 50%)";
    } else {
        let hue = 360 / arraySize * i;
        return "hsl(" + hue + ", 100%, 50%)";
    }
}

// Find the position and height of each rectangle
function getPos(i, num) {
    let rectangle = {
        x: 20 + i * (canvas.width - 40) / arraySize,
        y: canvas.height - 20,
        width: (canvas.width - 20) / arraySize - 4,
        height: ((canvas.height - 40) / arraySize) * -num
    };
    return rectangle;
}

// Fisher–Yates shuffle algorithm referenced from stackoverflow
// async function shuffle(array) {
//     let currentIndex = arraySize, randomIndex;
  
//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {
  
//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;
    
//         // And swap it with the current element.
//         await swap(array, currentIndex, randomIndex);
//         drawArr(array);
//     }
// }