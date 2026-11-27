'use strict';

const state = {
    secretNumber: '',
    attempts: 0,
    history: [], 
    isGameOver: false
};

const elements = {
    input: document.getElementById('guessInput'),
    checkBtn: document.getElementById('checkBtn'),
    newGameBtn: document.getElementById('newGameBtn'),
    message: document.getElementById('message'),
    attemptsCount: document.getElementById('attemptsCount'),
    historyList: document.getElementById('historyList')
};

function generateSecretNumber() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    return digits.slice(0, 4).join('');
}

function isValidInput(input) {
    if (input.length !== 4) return false;
    if (!/^\d+$/.test(input)) return false; 

    const uniqueDigits = new Set(input);
    return uniqueDigits.size === 4;
}

function calculateBullsAndCows(secret, guess) {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            bulls++;
        } else if (secret.includes(guess[i])) {
            cows++;
        }
    }
    return { bulls, cows };
}

function updateUI() {
    elements.attemptsCount.textContent = state.attempts;

    elements.historyList.innerHTML = '';
    state.history.forEach(record => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${record.guess}</span> <span>${record.bulls} бык(а), ${record.cows} коров(ы)</span>`;
        elements.historyList.appendChild(li);
    });
    
    elements.historyList.scrollTop = elements.historyList.scrollHeight;
}

function showMessage(text, type = '') {
    elements.message.textContent = text;
    elements.message.className = 'message ' + type;
}

function clearMessage() {
    showMessage('');
}

function endGame() {
    state.isGameOver = true;
    elements.input.disabled = true;
    elements.checkBtn.disabled = true;
    showMessage(`Победа! Угадано за ${state.attempts} попыток.`, 'success');
}


function handleCheck() {
    if (state.isGameOver) return;

    const inputValue = elements.input.value.trim();
    clearMessage();

    if (!isValidInput(inputValue)) {
        showMessage('Ошибка: введите ровно 4 разные цифры (без букв и символов).', 'error');
        return;
    }

    const { bulls, cows } = calculateBullsAndCows(state.secretNumber, inputValue);

    state.attempts++;
    state.history.push({ guess: inputValue, bulls, cows });
    
    elements.input.value = ''; // Очищаем поле
    elements.input.focus();
    
    updateUI();
    showMessage(`${inputValue} → ${bulls} бык(а), ${cows} коров(ы)`);

    if (bulls === 4) {
        endGame();
    }
}

function startNewGame() {
    state.secretNumber = generateSecretNumber();
    state.attempts = 0;
    state.history = [];
    state.isGameOver = false;

    elements.input.disabled = false;
    elements.checkBtn.disabled = false;
    elements.input.value = '';
    elements.input.focus();
    clearMessage();
    updateUI();
    
    console.log(`[DEBUG] Загаданное число: ${state.secretNumber}`); // Для отладки
}


elements.checkBtn.addEventListener('click', handleCheck);
elements.newGameBtn.addEventListener('click', startNewGame);

elements.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCheck();
    }
});

document.addEventListener('DOMContentLoaded', startNewGame);