let array, canvas, ctx, rect, rectY, rectWidth, arraySize, landscape, delayTime, pendingRecursion = 0;

// Initialize 
async function init() {
    disableButtons();

    canvas = document.getElementById('mainCanvas');
    ctx = canvas.getContext("2d");

    initCanvas();

    // Populate main array
    array = [];
    for (let i = 1; i <= arraySize; i++) {
        array.push(i);
    }

    // draw main array
    drawArr();

    // Start randomizing after a small delay
    setTimeout(() => {
        randomizeArray();
    }, 300);

    // Run selected algorithm when start button is clicked
    document.getElementById("startbtn").addEventListener("click", runSort);
}

async function randomizeArray() {
    disableButtons("randomize");

    await prettierShuffle();
    await prettierShuffle();
    
    enableButtons();
}

// Draw rectangles in array. Rectangle turns grey when it is being sorted or compared.
function drawArr(beingSorted) {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < arraySize; i++) { 
        if (i == beingSorted) {
            ctx.fillStyle = "hsl(0, 0%, 80%)";
        } else {
            ctx.fillStyle = getHSL(array[i]);
        }
        rect = getPos(i, array[i]);
        ctx.fillRect(rect.x, rectY, rectWidth, rect.height);
    }
}

// Run algorithms according to user selection
function runSort() {
    // Get the algorithm selected in dropdown menu...
    let algo = document.getElementById("algoselect");
    disableButtons("sorting");

    // Execute algorithms based on selection
    switch (algo.value) {
        case "selection":
            selectionSort();
            break;
        
        case "bubble":
            bubbleSort();
            break;

        case "insertion":
            insertionSort();
            break;

        case "quick":
            // Slowing the sorting a bit... Quicksort is too quick
            // The project's aim is to visualise, not compare sorting speed
            if (landscape == 1) {
                delayTime = 40;
            } else {
                delayTime = 20;
            }
            quickSort(0, arraySize-1);
            break;

        default:
            enableButtons();
            break;
    }
}

function disableButtons(state) {
    document.getElementById("algoselect").disabled = true;
    document.getElementById("randombtn").disabled = true;
    document.getElementById("startbtn").disabled = true;
}

function enableButtons() {
    document.getElementById("algoselect").disabled = false;
    document.getElementById("randombtn").disabled = false;
    document.getElementById("startbtn").disabled = false;
}

// A shuffle that looks prettier and more "random"
async function prettierShuffle() {
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
            await swap(randomIndex, randomIndexTwo); 
            shuffledNumber.push(randomIndex, randomIndexTwo)

            drawArr();
        }
    }
}

// Calculate HSL Hue value based on number in array
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

        height: ((canvas.height - canvasHeightOffset) / arraySize) * -num
    };
    return rectangle;
}

// Resize canvas, array size, and sorting speed in the event of size or orientation changes to the device
function initCanvas() {
    // if portrait
    if (window.innerHeight / window.innerWidth > 1.5) {
        landscape = 0;
        arraySize = 60;
        delayTime = 8;
        canvasHeightOffset = 180;
    } else { // if landscape
        landscape = 1;
        arraySize = 150;
        delayTime = 1;
        canvasHeightOffset = 100;
    }

    // Get size of canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Y position and width of each rect are always the same
    rectY = canvas.height - 20;
    rectWidth = (canvas.width - 20) / arraySize - 1;

    window.addEventListener('resize', drawArr, false);
    window.addEventListener('orientationchange', drawArr, false);
}