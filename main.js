let array, canvas, ctx, rect, arraySize, landscape, delayTime, pendingRecursion = 0;

// Initialize 
async function init() {
    disableButtons();

    canvas = document.getElementById('mainCanvas');
    ctx = canvas.getContext("2d");

    resizeCanvas();

    // Populate new array, draw each rectangle bar one by one
    array = [];
    for (let i = 1; i <= arraySize; i++) {
        array.push(i);
        await sleep(15);
        drawArr();
    }

    // Start randomize after a small delay
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

// Draw rectangles in array instantly. 
// Colour rectangle light grey if that element is being sorted or compared.
function drawArr(beingSorted) {  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < arraySize; i++) { 
        if (i == beingSorted) {
            ctx.fillStyle = "hsl(0, 0%, 80%)";
        } else {
            ctx.fillStyle = getHSL(array[i]);
        }
        rect = getPos(i, array[i]);
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
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
            // Slowing the sorting a bit... Quicksort is too quick!!!
            // While being quick is the algorithms' advantage, it's hard to see the algorithm work 
            if (landscape == 0) {
                delayTime = 20;
            } else {
                delayTime = 40;
            }
            quickSort(0, arraySize-1);
            break;

        default:
            enableButtons();
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
        width: (canvas.width - 20) / arraySize - 2,
        height: ((canvas.height - 40) / arraySize) * -num
    };
    return rectangle;
}

// Resize canvas in the event of size or orientation changes
function resizeCanvas() {
    // Set array size and sort speed based on device orientation
    if (window.innerHeight / window.innerWidth > 1.5) {
        arraySize = 50;
        delayTime = 20;
        landscape = 1;
    } else {
        arraySize = 100;
        delayTime = 8;
        landscape = 0;
    }

    window.addEventListener('resize', drawArr, false);
    window.addEventListener('orientationchange', drawArr, false);
}