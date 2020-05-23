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
    const width = 10
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

    //starting coordinate of tetromino top-left corner
    let currentPosition = 4
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

    timerId = setInterval(moveDown, 1000)

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
            getNewTetormino();
            currentPosition = 4;
            draw();
        }
    }

    function getNewTetormino() {
        /* Randomly select a new tetromino */
        random = Math.floor(Math.random() * theTetrominoes.length);
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
        if(current.some(index => sqaures[currentPosition + index].classlist.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    /* Function invoked when a key is pressed */
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        } else if(e.keyCode === 39) {
            moveRight();
        } else if(e.keyCode === 40) {
            moveDown();
        }
    }
    // Invokes `control` when *any* key is pressed
    // An `event` is passed to the control function
    document.addEventListener('keyup', control);
})