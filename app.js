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

})