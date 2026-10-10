let lastMoveTime = 0;
let animationFrameId = null;

function initGame() {
    initView();          
    resetGameState();    
    bindEvents();       
    startGameLoop();   
}

function bindEvents() {
    document.addEventListener('keydown', (e) => {
        const keyMap = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 }
        };

        if (keyMap[e.key]) {
            e.preventDefault(); // Чтобы страница не скроллилась
            changeDirection(keyMap[e.key]);
        }
    });

    
    document.getElementById('restartBtn').addEventListener('click', () => {
        resetGameState();
        lastMoveTime = performance.now();
    });
}

function startGameLoop() {
    function loop(currentTime) {
        
        if (lastMoveTime === 0) { lastMoveTime = currentTime; }
        const deltaTime = currentTime - lastMoveTime;
        if (deltaTime >= CONFIG.MOVE_INTERVAL) {
            updateGameState();
            lastMoveTime = currentTime - (deltaTime % CONFIG.MOVE_INTERVAL);
        }
        renderGame();
        animationFrameId = requestAnimationFrame(loop);
    }
    animationFrameId = requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', initGame);