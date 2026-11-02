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
          res(session === state.sessionId);}, ms);
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
      handleInput
    };
  }
  