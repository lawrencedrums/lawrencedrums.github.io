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
            drawArr(left);
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