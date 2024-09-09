const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const pairsDisplay = document.getElementById('pairs');
const timerDisplay = document.getElementById('time');
const colors = [
    'red', 'red', 'orange', 'orange', 'yellow', 'yellow', 'green', 'green', 
    'blue', 'blue', 'purple', 'purple', 'pink', 'pink', 'cyan', 'cyan', 
    'lime', 'lime', 'brown', 'brown', 'gray', 'gray', 'black', 'black', 
    'white', 'white', 'teal', 'teal', 'navy', 'navy', 'maroon', 'maroon'
];
const boardSize = 8;
let selectedColor = null;
let path = [];
let isDragging = false;
let startDot = null;
let pairs = 0;
let timer = 0;
let timerInterval;

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

function startGame() {
    resetGame();
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

function resetGame() {
    clearInterval(timerInterval);
    timer = 0;
    timerDisplay.textContent = timer;
    selectedColor = null;
    path = [];
    isDragging = false;
    startDot = null;
    pairs = 0;
    pairsDisplay.textContent = pairs;
    createBoard();
}

function createBoard() {
    gameBoard.innerHTML = '';
    const board = Array(boardSize * boardSize).fill(null);
    shuffle(colors);
    colors.forEach((color, index) => {
        let position;
        do {
            position = Math.floor(Math.random() * board.length);
        } while (board[position] !== null);
        board[position] = color;
    });

    board.forEach(color => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (color) dot.classList.add(color);
        dot.addEventListener('mousedown', (e) => startDrag(e, dot));
        dot.addEventListener('mouseup', (e) => endDrag(e, dot));
        dot.addEventListener('mouseenter', (e) => dragOver(e, dot));
        gameBoard.appendChild(dot);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startDrag(event, dot) {
    const color = dot.classList[1];
    if (!selectedColor) {
        selectedColor = color;
        path.push(dot);
        dot.classList.add('selected');
        isDragging = true;
        startDot = dot;
    }
}

function endDrag(event, dot) {
    if (isDragging && selectedColor === dot.classList[1] && !path.includes(dot)) {
        path.push(dot);
        dot.classList.add('selected');
        drawLine(startDot, dot, selectedColor);
        startDot = dot;
        if (path.length === 2) {
            checkPair();
        }
    }
    isDragging = false;
    selectedColor = null;
    path = [];
}

function dragOver(event, dot) {
    if (isDragging && selectedColor === dot.classList[1] && !path.includes(dot)) {
        path.push(dot);
        dot.classList.add('selected');
        drawLine(startDot, dot, selectedColor);
        startDot = dot;
        if (path.length === 2) {
            checkPair();
        }
    }
}

function drawLine(startDot, endDot, color) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.backgroundColor = color; // 设置线条颜色
    const startRect = startDot.getBoundingClientRect();
    const endRect = endDot.getBoundingClientRect();
    const x1 = startRect.left + startRect.width / 2 - gameBoard.getBoundingClientRect().left;
    const y1 = startRect.top + startRect.height / 2 - gameBoard.getBoundingClientRect().top;
    const x2 = endRect.left + endRect.width / 2 - gameBoard.getBoundingClientRect().left;
    const y2 = endRect.top + endRect.height / 2 - gameBoard.getBoundingClientRect().top;
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    line.style.left = `${x1}px`;
    line.style.top = `${y1 - 4}px`; // 调整线条对齐
    gameBoard.appendChild(line);
}

function checkPair() {
    const color1 = path[0].classList[1];
    const color2 = path[1].classList[1];
    if (color1 === color2) {
        pairs++;
        pairsDisplay.textContent = pairs;
        if (pairs === 32) {
            clearInterval(timerInterval);
            alert(`恭喜！你完成了所有的配对，游戏胜利！用时 ${timer} 秒`);
        }
    } else {
        setTimeout(() => {
            path[0].classList.remove('selected');
            path[1].classList.remove('selected');
            path = [];
        }, 500);
    }
}

createBoard();