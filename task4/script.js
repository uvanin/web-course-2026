'use strict';

const state = {
  secret: '',       
  history: [],       
  attempts: 0,     
  isOver: false      
};

const inputEl = document.getElementById('guess-input');
const checkBtn = document.getElementById('check-btn');
const newGameBtn = document.getElementById('new-game-btn');
const messageEl = document.getElementById('message');
const attemptsEl = document.getElementById('attempts-count');
const historyEl = document.getElementById('history-list');

function generateSecret() {
  const digits = ['0','1','2','3','4','5','6','7','8','9'];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, 4).join('');
}

function validateGuess(raw) {
  const value = raw.trim();
  if (value === '') {
    return { valid: false, error: 'Введите число из 4 цифр.' };
  }
  if (!/^\d+$/.test(value)) {
    return { valid: false, error: 'Только цифры, без букв и символов.' };
  }
  if (value.length !== 4) {
    return { valid: false, error: 'Нужно ровно 4 цифры.' };
  }
  if (new Set(value).size !== 4) {
    return { valid: false, error: 'Цифры не должны повторяться.' };
  }
  return { valid: true, error: '' };
}

function countBullsAndCows(secret, guess) {
  let bulls = 0;
  let cows = 0;
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      bulls++;
    } else if (secret.includes(guess[i])) {
      cows++;
    }
  }
  return { bulls, cows };
}

function renderAllHistory() {
  historyEl.innerHTML = '';
  state.history.forEach((step) => renderStep(step));
}
function renderStep(item) {
    const li = document.createElement('li');
    const guessSpan = document.createElement('span');
    guessSpan.className = 'guess';
    guessSpan.textContent = item.guess;

    const resultSpan = document.createElement('span');
    resultSpan.className = 'result';
    if (item.bulls === 4) {
      resultSpan.classList.add('win');
    }
    resultSpan.textContent = `${item.bulls} бык(ов), ${item.cows} коров(ы)`;

    li.append(guessSpan, resultSpan);
    historyEl.append(li);
  
}

function renderAll() {
  renderAllHistory(); 
  renderAttempts();
}

function renderMessage(text, type = 'info') {
  messageEl.textContent = text;
  messageEl.className = 'message';
  if (type) {messageEl.classList.add(type);}
}

function setInputEnabled(enabled) {
  inputEl.disabled = !enabled;
  checkBtn.disabled = !enabled;
}

function startNewGame() {
  state.secret = generateSecret();
  state.history = [];
  state.attempts = 0;
  state.isOver = false;
  inputEl.value = '';
  setInputEnabled(true);
  renderMessage('Новая игра! Введите 4 цифры.', 'info');
  renderAll();
  inputEl.focus();
}

function handleCheck() {
  if (state.isOver) return;

  const raw = inputEl.value;
  const validation = validateGuess(raw);

  if (!validation.valid) {
    renderMessage(validation.error, 'error');
    return;
  }

  const guess = raw.trim();
  const { bulls, cows } = countBullsAndCows(state.secret, guess);

  state.attempts++;
  state.history.push({ guess, bulls, cows });
  inputEl.value = '';

  if (bulls === 4) {
    state.isOver = true;
    setInputEnabled(false);
    renderMessage(`Победа! Угадано за ${state.attempts} попыток.`, 'win');
  } else {
    renderMessage(`${bulls} бык(ов), ${cows} коров(ы)`, 'info');
  }
  attemptsEl.textContent = state.attempts.toString(); 
  renderStep({ guess, bulls, cows });
}

checkBtn.addEventListener('click', handleCheck);
newGameBtn.addEventListener('click', startNewGame);

inputEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleCheck();
  }
});

inputEl.addEventListener('input', () => {
  inputEl.value = inputEl.value.replace(/\D/g, '').slice(0, 4);
});

startNewGame();