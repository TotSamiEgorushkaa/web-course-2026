let secretNumber = '';
let attempts = 0;
let history = [];
let isGameOver = false;

const input = document.getElementById('guessInput');
const checkBtn = document.getElementById('checkBtn');
const newGameBtn = document.getElementById('newGameBtn');
const messageBox = document.getElementById('messageBox');
const historyList = document.getElementById('historyList');

function generateSecretNumber() {
    let digits = [];
    while (digits.length < 4) {
        let randomDigit = Math.floor(Math.random() * 10).toString();
        if (!digits.includes(randomDigit)) {
            digits.push(randomDigit);
        }
    }
    return digits.join('');
}

function validateInput(value) {
    if (value.length !== 4) {
        return "Ошибка: нужно ввести ровно 4 цифры.";
    }
    if (!/^\d+$/.test(value)) {
        return "Ошибка: можно вводить только цифры.";
    }
    for (let i = 0; i < value.length; i++) {
        for (let j = i + 1; j < value.length; j++) {
            if (value[i] === value[j]) {
                return "Ошибка: цифры не должны повторяться.";
            }
        }
    }
    return null;
}

function countBullsAndCows(secret, guess) {
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

function renderHistory() {
    historyList.innerHTML = '';
    for (let i = 0; i < history.length; i++) {
        const li = document.createElement('li');
        li.textContent = history[i];
        historyList.appendChild(li);
    }
}

function startNewGame() {
    secretNumber = generateSecretNumber();
    attempts = 0;
    history = [];
    isGameOver = false;
    
    input.value = '';
    input.disabled = false;
    checkBtn.disabled = false;
    messageBox.textContent = '';
    messageBox.className = 'message';
    renderHistory();
}

checkBtn.addEventListener('click', function() {
    if (isGameOver) return;

    let userGuess = input.value.trim();
    
    let error = validateInput(userGuess);
    if (error) {
        messageBox.textContent = error;
        messageBox.className = 'message error';
        return;
    }

    messageBox.textContent = '';
    attempts++;

    let result = countBullsAndCows(secretNumber, userGuess);

    let historyString = `${userGuess} -> ${result.bulls} бык(а), ${result.cows} коров(ы)`;
    history.push(historyString);
    renderHistory();

    if (result.bulls === 4) {
        isGameOver = true;
        messageBox.textContent = `Победа! Угадано за ${attempts} попыток.`;
        messageBox.className = 'message success';
        input.disabled = true;
        checkBtn.disabled = true;
    } else {
        input.value = '';
        input.focus();
    }
});

newGameBtn.addEventListener('click', startNewGame);

startNewGame();