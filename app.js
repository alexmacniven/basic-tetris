// Fires when HTML has been loaded
document.addEventListener('DOMContentLoaded', () => {
    // Locates and assigns HTML div with the grid class
    // to const 'grid'.
    // Wouldn't this be better using an ID instead of a Class?
    const grid = document.querySelector('.grid')
    // .querySelectorAll locates all child div elements of the div element whose class
    // is 'grid'.
    // Array.from() creates an array from all elements located by .querySelectorAll.
    // In this case does .querySelector locate the first element with the class of 'grid'?
    let squares = Array.from(document.querySelectorAll('.grid div'))
    // Selects all div squares in the mini-grid
    let displaySquares = Array.from(document.querySelectorAll('.mini-grid div'));
    let nextRandom = 0;
    const width = 10;
    let timerId;
    const displayWidth = 4;
    var score = 0;
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    // Map out the coordinates of the L shaped tetrominoes
    // Check out https://youtu.be/rAUn1Lom6dw?t=2160
    // Creating a nested array where each inner array element is a collection of coordinates
    // Each coordinate describes a coloured block of the tetronome
    // As the grid has a width of 10, each new row has a coordinate of width
    /* |01|02|03|
       |10|11|12|
       |20|21|22|
    */
   // A tetromino is drawn like;
   /*  |  |xx|  |
      |  |xx|  |
     |xx|xx|  |
    */
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2, width*2+1],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1],
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]

    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    /* 
    An array of Tetrominoes in their first rotation *only* for use in
    the mini-grid preview.
    */
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], // lTetromino
        [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1], // zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], // tTetromino
        [0, 1, displayWidth, displayWidth+1], // oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //starting coordinate of tetromino top-left corner
    let currentPosition = 4
    let displayIndex = 0; // Starting postition of the mini-grid
    let currentRotation = 0

    /* select a random tetromino shape */
    //random number between 0 and 4 inclusive
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //a function to draw a tetromino shape
    function draw() {
        current.forEach(index => {
            /* 
            Remember `squares` references all the `div`s inside the `.grid` element
            as an array. By iterating we over each coordinate of the tetromino
            ([1, width+1, width*2+1, 2]) and offsetting by 4, we can apply the rules
            described by `.tetromino` in the CSS.
            */
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    //a function to undraw a tetromino shape
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    /**
     * Displays the next Tetromino shape on the mini-grid
     */
    function displayNextTetromino() {
        // Iterate over each square in the mini-grid, removing 'tetromino'
        // from the list of applied classes.
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        });
        // Iterate over each coordinate in the next tetromino shape, adding
        // 'tetromino' to the list of applied classes to the corresponding 
        // coordinate in the mini-grid.
        upNextTetrominoes[nextRandom].forEach(index => {
            let drawIndex = displayIndex + index;
            console.log(drawIndex);
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    function moveDown() {
        undraw();
        //moves down the tetronimo one row
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        /* 
        For each square in the tetromino; examine the same square on the row below it.
        When an examined square has a class 'taken' then the tetromino has reached vertical
        limit it can move down and all it's squares are to be given the class taken.

        There is a hidden row at the bottom of the visible grid where all it's squares are
        marked 'taken' to prevent the tetromino moving beyond the confides of the grid.

        When all a tetromino element has `taken` added to it's class list; a new tetromino
        is created and draw at the top of the grid.
        */ 
        if (current.some(index=>squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            addScore();
            getNewTetormino();
            currentPosition = 4;
            draw();
            displayNextTetromino();
        }
    }

    function getNewTetormino() {
        /* Randomly select a new tetromino */
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
    }

    function moveLeft() {
        /* Legally moves the tetromino to the left */
        undraw();
        // True when any part of tetromino is at a position divisible by 10
        const isLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        // When no part of the shape is on the left edge, current postion is reduced
        if(!isLeftEdge) currentPosition -=1;
        // Check any part of the tetromino is now in a square with the class taken
        // When True; increase current position (effectively undoing the reduction)
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        /* Legally moves the tetromino to the right */
        undraw()
        // True when any part of the tetromino is at a position where dividing by 10 gives remainder 9
        const isRightEdge = current.some(index => (currentPosition + index) % width === 9);
        // When no part of the tetromino is at right edge, current position is increased
        if(!isRightEdge) currentPosition += 1;
        /// When any part of the tetromino is now in a `taken` square; reduce current postion
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        undraw();
        currentRotation++;
        // Resets rotation to 0 if it reaches 4
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        // Selects new rotation as the current shape
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    /* Function invoked when a key is pressed */
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        } else if(e.keyCode === 38) {
            rotate();
        } else if(e.keyCode === 39) {
            moveRight();
        } else if(e.keyCode === 40) {
            moveDown();
        }
    }
    // Invokes `control` when *any* key is pressed
    // An `event` is passed to the control function
    document.addEventListener('keyup', control);

    startButton.addEventListener('click', () => {
        // When timerId has been initiated; clear and set to null
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            // Draw the next shape, initiate the timer and display the next shape
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayNextTetromino();
        }
    })

    function addScore() {
        // iterate over the first column in each row
        for (let i = 0; i < 199; i += width) {
            // create an array referencing each square in the row
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            // when every square in the row has the class 'taken'
            if(row.every(index => squares[index].classList.contains('taken'))) {
                // update the score value
                score += 10;
                scoreDisplay.innerHTML = score;
                // remove 'taken' and 'tetromino' from each squares classlist
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                })
                // remove 10 squares from the current row i
                const squaresRemoved = squares.splice(i, width);
                // add removed sqaures to the top/start of the sqaures array
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }
})