function createController(model, view) {
    let lastMoveTime = 0;
    let animationFrameId = null;

    function initGame() {
        view.initView();
        model.resetGameState();
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
                e.preventDefault();
                model.changeDirection(keyMap[e.key]);
            }
        });

        view.getRestartBtn().addEventListener('click', () => {
            model.resetGameState();
            lastMoveTime = performance.now();
        });
    }

    function startGameLoop() {
        function loop(currentTime) {
            if (lastMoveTime === 0) {
                lastMoveTime = currentTime;
            }
            const deltaTime = currentTime - lastMoveTime;
            if (deltaTime >= model.CONFIG.MOVE_INTERVAL) {
                model.updateGameState();
                lastMoveTime = currentTime - (deltaTime % model.CONFIG.MOVE_INTERVAL);
            }
            view.renderGame(model.gameState, model.CONFIG);
            animationFrameId = requestAnimationFrame(loop);
        }
        animationFrameId = requestAnimationFrame(loop);
    }

    return {initGame};
}