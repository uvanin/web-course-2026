   (() => {
    "use strict";
    
    const SHOW_DELAY   = 500;  
    const GAP_DELAY    = 220;  
    const START_DELAY  = 600;  
  
    const boardEl   = document.getElementById("board");
    const sectors   = Array.from(document.querySelectorAll(".sector"));
    const startBtn  = document.getElementById("startBtn");
    const levelEl   = document.getElementById("level");
    const statusEl  = document.getElementById("status");
  
    const state = {
      sequence: [],        
      playerInput: [],     
      level: 0,            
      isShowing: false,         
      isWaiting: false,    
      isGameOver: false,   
      timers: [],          
      sessionId: 0          
    };
  
    function scheduleTimer(callback, delay) {
      const id = setTimeout(() => {
        state.timers = state.timers.filter((t) => t !== id);
        callback();
      }, delay);
      state.timers.push(id);
      return id;
    }

    function clearAllTimers() {
      state.timers.forEach((id) => clearTimeout(id));
      state.timers = [];
    }
  
    function wait(ms, session) {
      return new Promise((resolve) => {
        const id = setTimeout(() => {
          state.timers = state.timers.filter((t) => t !== id);
          resolve(session === state.sessionId);
        }, ms);
        state.timers.push(id);
      });
    }
  
    function randomSectorIndex() {
      return Math.floor(Math.random() * 4);
    }
  
    function extendSequence() {
      state.sequence.push(randomSectorIndex());
    }
  
    async function showSequence(session) {
      state.isShowing = true;
      state.isWaiting = false;
      boardEl.classList.add("locked");
      setStatus("Запоминайте...");
  
      await wait(START_DELAY, session);
      if (session !== state.sessionId) return false;
  
      for (let i = 0; i < state.sequence.length; i++) {
        const index = state.sequence[i];
  
        highlightSector(index, true);
  
        const ok = await wait(SHOW_DELAY, session);
        if (!ok) return false;
  
        highlightSector(index, false);
  
        const okGap = await wait(GAP_DELAY, session);
        if (!okGap) return false;
      }
  
      state.isShowing = false;
      state.isWaiting = true;
      boardEl.classList.remove("locked");
      setStatus("Ваш ход");
      return true;
    }
  
    
    function highlightSector(index, on) {
      const el = sectors[index];
      if (!el) return;
      el.classList.toggle("active", on);
    }
  
    function setStatus(text) {
      statusEl.textContent = text;
    }
  
    function updateLevelDisplay() {
      levelEl.textContent = String(state.level);
    }
  
    function handleSectorClick(event) {
      const sector = event.currentTarget;
      const index = Number(sector.dataset.index);
  
      if (!state.isWaiting || state.isShowing || state.isGameOver) return;
  
      highlightSector(index, true);
      scheduleTimer(() => highlightSector(index, false), 180);
  
      state.playerInput.push(index);
      const step = state.playerInput.length - 1;
  
      if (state.playerInput[step] !== state.sequence[step]) {
        endGame();
        return;
      }
  
      if (state.playerInput.length === state.sequence.length) {
        state.isWaiting = false;
        boardEl.classList.add("locked");
        setStatus("Верно! Следующий уровень...");
        scheduleTimer(() => nextRound(), 700);
      }
    }
  
    async function nextRound() {
      state.playerInput = [];
      extendSequence();
      state.level = state.sequence.length;
      updateLevelDisplay();
  
      const session = state.sessionId;
      await showSequence(session);
    }
  
    function endGame() {
      state.isGameOver = true;
      state.isWaiting = false;
      state.isShowing = false;
  
      clearAllTimers();
      state.sessionId++;
  
      boardEl.classList.add("locked");
      setStatus(`Вы дошли до уровня ${state.level}`);
      startBtn.disabled = false;
      startBtn.textContent = "Старт";
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
  
      sectors.forEach((s) => s.classList.remove("active"));
      boardEl.classList.remove("locked");
      updateLevelDisplay();
      startBtn.disabled = true;
      startBtn.textContent = "Игра идёт...";
      nextRound();
    }
  
    function init() {
      sectors.forEach((sector) => {
        sector.addEventListener("click", handleSectorClick);
      });
      startBtn.addEventListener("click", startGame);
      boardEl.classList.add("locked");
      setStatus("Нажмите «Старт»");
      updateLevelDisplay();
    }
  
    init();
  })();