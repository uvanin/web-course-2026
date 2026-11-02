function createModel() {

  const SHOW_DELAY   = 500;  
  const GAP_DELAY    = 220;  
  const START_DELAY  = 600;  

  const state = {
    sequence: [],
    playerInput: [], 
    level: 0,
    isShowing: false, 
    isWaiting: false, 
    isGameOver: false, 
    inputLocked: false,
    timers: [], 
    sessionId: 0          
  };

  let onStateChange = () => {};
  let onHighlight = () => {};

  function scheduleTimer(callback, delay) {
    const id = setTimeout(() => {
      state.timers = state.timers.filter((t) => t !== id);
      callback();
    }, delay);
    state.timers.push(id);
  }

  function clearAllTimers() {
    state.timers.forEach(clearTimeout);
    state.timers = [];
  }

  function wait(ms, session) {
    return new Promise(res => {
      const id = setTimeout(() => {
        state.timers = state.timers.filter(t => t !== id);
        res(session === state.sessionId);
      }, ms);
      state.timers.push(id);
    });
  }

  async function showSequence() {
    state.isShowing = true; state.isWaiting = false; state.inputLocked = true;
    onStateChange("sequence-start", state);

    const session = state.sessionId;
    await wait(START_DELAY, session);
    if (session !== state.sessionId) return;

    for (let index of state.sequence) {
      onHighlight(index, true);
      if (!await wait(SHOW_DELAY, session)) return;
      onHighlight(index, false);
      if (!await wait(GAP_DELAY, session)) return;
    }

    state.isShowing = false; state.isWaiting = true; state.inputLocked = false;
    onStateChange("sequence-end", state);
  }

  function nextRound() {
    state.playerInput = [];
    state.sequence.push(Math.floor(Math.random() * 4));
    state.level = state.sequence.length;
    showSequence();
  }

  function startGame() {
    clearAllTimers();
    state.sessionId++;
    state.sequence = []; 
    state.playerInput = []; 
    state.level = 0;
    state.isShowing = false; 
    state.isWaiting = false; 
    state.isGameOver = false; 
    state.inputLocked = false;
    
    onStateChange("start", state);
    nextRound();
  }

  function endGame() {
    state.isGameOver = true;
    state.isWaiting = false; 
    state.isShowing = false; 
    state.inputLocked = false;
    clearAllTimers();
    state.sessionId++;
    onStateChange("gameover", state);
  }

  function handleInput(index) {
    if (!state.isWaiting || state.isShowing || state.isGameOver || state.inputLocked) return;
    
    state.inputLocked = true;
    onHighlight(index, true);
    scheduleTimer(() => {
       onHighlight(index, false);
       state.inputLocked = false;
       }, 180);

    state.playerInput.push(index);
    const step = state.playerInput.length - 1;

    if (state.playerInput[step] !== state.sequence[step]) {
      state.inputLocked = false;
      endGame();
      return;
    }

    if (state.playerInput.length === state.sequence.length) {
      state.isWaiting = false; state.inputLocked = true;
      onStateChange("correct", state);
      scheduleTimer(() => nextRound(), 700);
    }
  }

  return {
    state,
    onChange: (cb) => onStateChange = cb,
    onHighlight: (cb) => onHighlight = cb,
    startGame,
    handleInput};
}

function createView() {
  const boardEl = document.getElementById("board");
  const sectors = Array.from(document.querySelectorAll(".sector"));
  const startBtn = document.getElementById("startBtn");
  const levelEl = document.getElementById("level");
  const statusEl = document.getElementById("status");

  return {
    renderStatus: (text) => statusEl.textContent = text,
    renderLevel: (level) => levelEl.textContent = String(level),
    lockBoard: (lock) => boardEl.classList.toggle("locked", lock),
    clearSectors: () => sectors.forEach(s => s.classList.remove("active")),
    
    renderBtn: (disabled, text) => {
      startBtn.disabled = disabled;
      startBtn.textContent = text;
    },
    highlight: (index, on) => {
      if (sectors[index]) sectors[index].classList.toggle("active", on);
    },
    bind: (onStart, onSector) => {
      startBtn.addEventListener("click", onStart);
      sectors.forEach(s => s.addEventListener("click",
         e => onSector(Number(e.currentTarget.dataset.index)))
        );
    }
  };
}

function createController(model, view) {
  model.onChange((event, state) => {
    switch (event) {
      case "start":
        view.clearSectors();
        view.lockBoard(false);
        view.renderLevel(state.level);
        view.renderBtn(true, "Игра идёт...");
        break;
      case "sequence-start":
        view.lockBoard(true);
        view.renderStatus("Запоминайте...");
        break;
      case "sequence-end":
        view.lockBoard(false);
        view.renderStatus("Ваш ход");
        break;
      case "correct":
        view.lockBoard(true);
        view.renderStatus("Верно! Следующий уровень...");
        break;
      case "gameover":
        view.lockBoard(true);
        view.renderStatus(`Вы дошли до уровня ${state.level}`);
        view.renderBtn(false, "Старт");
        break;
    }
    view.renderLevel(state.level);
  });

  model.onHighlight((index, on) => view.highlight(index, on));

  return {
    init: () => {
      view.bind(
        () => model.startGame(),            
        (index) => model.handleInput(index) 
      );
      view.lockBoard(true);
      view.renderStatus("Нажмите «Старт»");
      view.renderLevel(model.state.level);
    }
  };
}