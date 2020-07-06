let array, canvas, ctx, rect, num;
let arraySize = 120, delayTime = 6, landscape = 1;

function init() {
    disableButtons();
    canvas = document.getElementById('mainCanvas');
    ctx = canvas.getContext("2d");

    // Base array size and sort speed on device orientation
    if (window.innerHeight / window.innerWidth > 1.5) {
        arraySize = 50;
        delayTime = 15;
        landscape = 0;
    }

    // Populate new array
    array = [];
    for (let i = 1; i <= arraySize; i++) {
        array.push(i);
    }
    drawArr();

    // Randomize after a set delay
    setTimeout(() => {
        randomizeArray();
    }, 1000);

    resizeCanvas();

    // Run the algorithm selected when start button is clicked
    document.getElementById("startbtn").addEventListener("click", function() {
        let algo = document.getElementById("algoselect");

        switch (algo.value) {
            case "bubble":
                bubbleSort();
                break;
            case "insertion":
                insertionSort();
                break;
            case "merge":
                mergeSort(array);
                break;
            default:
        }
    }, false);
} 

async function randomizeArray() {
    disableButtons("randomize");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await prettierShuffle();
    enableButtons();
}

// Draw rectangles in array instantly. Colour rectangle black if that number is being sorted.
function drawArr(beingSorted) {  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
    disableButtons("sorting");

    for (n = 0; n < end; end--) {
        for (i = 0, j = 1; i < arraySize; i++, j++) {
            if (array[i] > array[j]) {
                await swap(i, j);
                drawArr(j);
            }
        }
    }
    drawArr(j);
    enableButtons();
}

async function insertionSort() {
    let key, i, j;
    disableButtons("sorting");

    for (i = 1; i < arraySize; i++) {
        key = array[i];
        j = i - 1;

        while (j >= 0 && array[j] > key) {
            await sleep(delayTime);
            array[j + 1] = array[j];
            drawArr(j);
            j--;
        }
        array[j + 1] = key;
    }
    drawArr();
    enableButtons();
}

function mergeSort(array) {
    let middle, left, right;

    if (array.length > 1) {
        middle = array.length / 2;
        left = array.splice(0, middle);
        right = array;

        console.log(left, right);
        return merge(mergeSort(left), mergeSort(right));
    } else {
        return array;
    }
}

function merge(left, right) {
    let resultArray = [], leftIndex = 0, rightIndex = 0;
    while (left.length > leftIndex && right.length > rightIndex) {

        // Push left into array if it is smaller vice versa
        if (left[leftIndex] < right[rightIndex]) {
        resultArray.push(left[leftIndex]);
        leftIndex++;
        } else {
        resultArray.push(right[rightIndex]);
        rightIndex++;
        }
    }
    
    if (leftIndex < rightIndex) {
        console.log(resultArray);
        return resultArray.concat(left.slice(leftIndex));
    } else {
        console.log(resultArray);
        return resultArray.concat(right.slice(rightIndex));
    }
}

async function swap(x, y) {
    await sleep(delayTime);
    let temp = array[x];
    array[x] = array[y];
    array[y] = temp;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function disableButtons(state) {
    document.getElementById("algoselect").disabled = true;
    document.getElementById("randombtn").disabled = true;
    document.getElementById("startbtn").disabled = true;

    switch (state) {
        case "randomize":
            console.log("Randomizing...")
            break;
        case "sorting":
            console.log("Sorting...")
            break;
        default:
            console.log("Initializing..."); 
    }
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
        width: (canvas.width - 20) / arraySize - 4,
        height: ((canvas.height - 40) / arraySize) * -num
    };
    return rectangle;
}

// Resize canvas in the event of size or orientation change
function resizeCanvas() {
    window.addEventListener('resize', drawArr, false);
    window.addEventListener('orientationchange', drawArr, false);
}