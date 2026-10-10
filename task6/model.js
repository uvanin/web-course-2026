
const CONFIG = {
    TILE_SIZE: 20,
    GRID_WIDTH: 20,
    GRID_HEIGHT: 20,
    MOVE_INTERVAL: 150, 
    COLORS: {
        SNAKE_HEAD: '#2ecc71',
        SNAKE_BODY: '#27ae60',
        APPLE: '#e74c3c',
        TEXT: '#ecf0f1'
    }
};

const gameState = {
    snake: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    apple: { x: 0, y: 0 },
    score: 0,
    isGameOver: false
};

function resetGameState() {
    gameState.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    gameState.direction = { x: 1, y: 0 };
    gameState.nextDirection = { x: 1, y: 0 };
    gameState.score = 0;
    gameState.isGameOver = false;
    gameState.apple = spawnApple();
}

function spawnApple() {
    let newApple;
    let isOccupied = true;
    
    while (isOccupied) {
        newApple = {
            x: Math.floor(Math.random() * CONFIG.GRID_WIDTH),
            y: Math.floor(Math.random() * CONFIG.GRID_HEIGHT)
        };
        isOccupied = gameState.snake.some(segment => segment.x === newApple.x && segment.y === newApple.y);
    }
    return newApple;
}

function changeDirection(newDir) {
    if (gameState.isGameOver) return;
    if (gameState.direction.x === -newDir.x && gameState.direction.y === -newDir.y) { return;}
    gameState.nextDirection = newDir;
}

function updateGameState() {
    if (gameState.isGameOver) return;

    gameState.direction = gameState.nextDirection;

    const head = gameState.snake[0];
    const newHead = {
        x: head.x + gameState.direction.x,
        y: head.y + gameState.direction.y
    };

    if (
        newHead.x < 0 || newHead.x >= CONFIG.GRID_WIDTH ||
        newHead.y < 0 || newHead.y >= CONFIG.GRID_HEIGHT
    ) {
        gameState.isGameOver = true;
        return;
    }
    const willEat = (newHead.x === gameState.apple.x && newHead.y === gameState.apple.y);
    const bodyToCheck = willEat ? gameState.snake : gameState.snake.slice(0, -1);
    if (bodyToCheck.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameState.isGameOver = true;
        return;
    }
    gameState.snake.unshift(newHead);

    if (willEat) {
        gameState.score++;
        gameState.apple = spawnApple();
    } else {
        gameState.snake.pop();
    }
}