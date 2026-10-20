const sectors = [
    document.getElementById('btn-0'),
    document.getElementById('btn-1'),
    document.getElementById('btn-2'),
    document.getElementById('btn-3')
];
const startBtn = document.getElementById('start-btn');
const statusText = document.getElementById('status');

let sequence = [];
let playerIndex = 0;
let isPlaying = false;
let isGameActive = false;
let timeouts = [];

startBtn.addEventListener('click', startGame);

function startGame() {
    clearAllTimeouts();

    sequence = [];
    isGameActive = true;
    startBtn.disabled = true;
    statusText.textContent = 'Уровень 1';

    nextRound();
}

function nextRound() {
    playerIndex = 0;
    const randomSector = Math.floor(Math.random() * 4);
    sequence.push(randomSector);

    statusText.textContent = `Уровень ${sequence.length}`;

    playSequence();
}

function playSequence() {
    isPlaying = true;

    sequence.forEach((sectorId, index) => {
        const showTimer = setTimeout(() => {
            flashSector(sectorId);
        }, 600 * (index + 1));

        timeouts.push(showTimer);
    });

    const endShowTimer = setTimeout(() => {
        isPlaying = false;
    }, 600 * (sequence.length + 1));

    timeouts.push(endShowTimer);
}

function flashSector(sectorId) {
    const btn = sectors[sectorId];
    btn.classList.add('active');

    const offTimer = setTimeout(() => {
        btn.classList.remove('active');
    }, 300);

    timeouts.push(offTimer);
}

sectors.forEach((sector, index) => {
    sector.addEventListener('click', () => {
        if (!isGameActive || isPlaying) return;

        flashSector(index);

        if (sequence[playerIndex] === index) {
            playerIndex++;

            if (playerIndex === sequence.length) {
                isPlaying = true;
                statusText.textContent = 'Верно! Следующий раунд...';

                const nextRoundTimer = setTimeout(nextRound, 1000);
                timeouts.push(nextRoundTimer);
            }
        } else {
            gameOver();
        }
    });
});

function gameOver() {
    isGameActive = false;
    isPlaying = false;
    clearAllTimeouts();

    statusText.textContent = `Вы дошли до уровня ${sequence.length}`;
    startBtn.disabled = false;

    document.body.style.backgroundColor = '#ffcccc';
    setTimeout(() => document.body.style.backgroundColor = '#f0f0f0', 500);
}

function clearAllTimeouts() {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];

    sectors.forEach(s => s.classList.remove('active'));
}