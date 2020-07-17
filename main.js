let array, canvas, ctx, rect, num;
let arraySize = 100, landscape = 1, delayTime = 6, pendingRecursion = 0;

function init() {
    disableButtons();
    canvas = document.getElementById('mainCanvas');
    ctx = canvas.getContext("2d");

    // Populate new array
    array = [];
    for (let i = 1; i <= arraySize; i++) {
        array.push(i);
    }
    drawArr();

    // Start randomize after a one second delay
    setTimeout(() => {
        randomizeArray();
    }, 1000);

    resizeCanvas();

    // Run selected algorithm when start button is clicked
    document.getElementById("startbtn").addEventListener("click", runSort);
} 

async function randomizeArray() {
    disableButtons("randomize");

    // Base array size and sort speed on device orientation
    if (window.innerHeight / window.innerWidth > 1.5) {
        arraySize = 50;
        delayTime = 15;
        landscape = 0;
    }

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
            ctx.fillStyle = "hsl(0, 0%, 80%)";
        } else {
            ctx.fillStyle = getHSL(array[i]);
        }
        rect = getPos(i, array[i]);
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
}

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
            // While quick is the algorithms' advantage, this project's point is to visualize the sorting
            // instead of focusing on the efficiency/speed of the algorithms
            delayTime = 15;
            quickSort(0, arraySize-1);
            break;

        default:
    }
}

async function selectionSort() {
    let i, j, min;

    for (i = 0; i < arraySize; i++) {
        min = i;
        j = i + 1;

        while (j < arraySize) {
            if (array[j] < array[min]) {
                min = j;
            }
            await sleep(delayTime);
            drawArr(j);
            j++;
        }
        await swap(min, i);
        drawArr(min);
    }
    drawArr();
    enableButtons();
}

async function bubbleSort() {
    let n, i, j;
    let end = arraySize;

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

async function quickSort(lowIndex, highIndex) {
    // If the array contains more than one element...
    if (lowIndex < highIndex) {
        pendingRecursion++;

        // Divide the array by the pivot
        let pivot = await partition(lowIndex, highIndex);

        // Quicksort the left and right sub-arrays
        quickSort(lowIndex, pivot - 1);
        quickSort(pivot + 1, highIndex);

        pendingRecursion--;
    }
    drawArr();

    // Reset only when all the recursions are done
    if (pendingRecursion == 0) {
        delayTime = 6;
        enableButtons();
    }
}

// Pick the last index as pivot and place it in the corret positiion in sorted array
async function partition(lowIndex, highIndex) {
    let pivot = array[highIndex], left = lowIndex, right = highIndex - 1;

    // While the left index is not greater than the right index
    while (left <= right) {

        // Swap left and right values if they are greater and lesser than the pivot, respectively
        // Increment/decrement left/right indices afterwards
        if (array[left] > pivot && array[right] < pivot) {
            await swap(left, right);
            drawArr(right);
            left++;
            right--;
        }

        // Increment/decrement left/right index if the value on the left/right is already in the correct side of the array
        while (array[left] < pivot) {
            await sleep(delayTime);
            drawArr(left);
            left++;
        }
        while (array[right] > pivot) {
            await sleep(delayTime);
            drawArr(right);
            right--;
        } 
    }

    // Place pivot in its' sorted place in the array
    await swap(left, highIndex);
    drawArr(highIndex);
    // Return the pivot which is now the left value
    return left;
}

// Swap places with indice x and y in array
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