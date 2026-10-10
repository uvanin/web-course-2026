/**
 * VIEW: Отвечает исключительно за отрисовку на Canvas.
 */

let canvas;
let ctx;
let scoreElement;
let restartBtn;

function initView() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    scoreElement = document.getElementById('score');
    restartBtn = document.getElementById('restartBtn');
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
        x * CONFIG.TILE_SIZE,
        y * CONFIG.TILE_SIZE,
        CONFIG.TILE_SIZE - 1, 
        CONFIG.TILE_SIZE - 1
    );
}

function renderGame() {
    clearCanvas();

    drawRect(gameState.apple.x, gameState.apple.y, CONFIG.COLORS.APPLE);

    gameState.snake.forEach((segment, index) => {
        const color = index === 0 ? CONFIG.COLORS.SNAKE_HEAD : CONFIG.COLORS.SNAKE_BODY;
        drawRect(segment.x, segment.y, color);
    });

    scoreElement.textContent = gameState.score;
    if (gameState.isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = CONFIG.COLORS.TEXT;
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Итоговый счёт: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 20);
        
        restartBtn.classList.remove('hidden');
    } else {
        restartBtn.classList.add('hidden');
    }
}