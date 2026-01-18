const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const startButton = document.getElementById('startButton');

const GRID_SIZE = 20;
const GRID_COUNT = canvas.width / GRID_SIZE;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameRunning = false;

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    score = 0;
    gameRunning = true;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    generateFood();
    gameLoop();
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * GRID_COUNT),
        y: Math.floor(Math.random() * GRID_COUNT)
    };

    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

function gameLoop() {
    if (!gameRunning) return;

    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        gameLoop();
    }, 150);
}

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
        gameOver();
        return;
    }

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = '#00ff88';
    for (let segment of snake) {
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    }
}

function drawFood() {
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
}

function changeDirection(x, y) {
    if (!gameRunning) return;
    if (direction.x === -x || direction.y === -y) return;
    direction = { x, y };
}

function gameOver() {
    gameRunning = false;
    gameOverElement.style.display = 'block';
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    if (!gameRunning && e.key === 'Enter') {
        startGame();
        return;
    }
    if (!gameRunning) return;

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection(0, -1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection(0, 1);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection(1, 0);
            break;
    }
});

clearCanvas();