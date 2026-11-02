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