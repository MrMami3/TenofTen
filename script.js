const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const scoreScreen = document.getElementById('score-screen');
const board = document.getElementById('game-board');
const nextNumDisplay = document.getElementById('next-number');
const usernameInput = document.getElementById('username');
const scoreList = document.getElementById('score-list');

let currentNumber = 1;
let lastSelected = null;
let currentPlayer = "";

// Buton Kontrolleri
document.getElementById('play-btn').onclick = () => {
    const name = usernameInput.value.trim();
    if (!name) return alert("Bro ismini yazmadın!");
    currentPlayer = name;
    document.getElementById('player-label').textContent = "PİLOT: " + name;
    switchScreen(gameScreen);
    initGame();
};

document.getElementById('show-scores-btn').onclick = () => {
    loadScores();
    switchScreen(scoreScreen);
};

document.getElementById('back-btn').onclick = () => switchScreen(menuScreen);
document.getElementById('quit-btn').onclick = () => switchScreen(menuScreen); // Oyun içindeki Geri butonu
document.getElementById('reset-btn').onclick = initGame;

function switchScreen(screen) {
    [menuScreen, gameScreen, scoreScreen].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

// Oyun Başlatma
function initGame() {
    currentNumber = 1;
    lastSelected = null;
    nextNumDisplay.textContent = "1";
    board.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.onclick = () => makeMove(i, cell);
        board.appendChild(cell);
    }
    refreshMoves();
}

function makeMove(index, cell) {
    const r = Math.floor(index / 10);
    const c = index % 10;

    if (cell.classList.contains('filled')) return;

    if (currentNumber === 1 || checkRule(r, c)) {
        cell.textContent = currentNumber;
        cell.classList.add('filled');
        lastSelected = { r, c };
        
        if (currentNumber === 100) alert("REİS YAPTIK BE! 100!");

        saveToLeaderboard(currentPlayer, currentNumber);
        currentNumber++;
        nextNumDisplay.textContent = currentNumber;
        refreshMoves();
    }
}

function checkRule(r, c) {
    if (!lastSelected) return true;
    const rd = Math.abs(r - lastSelected.r);
    const cd = Math.abs(c - lastSelected.c);
    return ((rd === 3 && cd === 0) || (rd === 0 && cd === 3) || (rd === 2 && cd === 2));
}

function refreshMoves() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        cell.classList.remove('valid-move');
        const r = Math.floor(i / 10), c = i % 10;
        if (!cell.classList.contains('filled') && checkRule(r, c)) {
            cell.classList.add('valid-move');
        }
    });
}

// Skor Yönetimi
function saveToLeaderboard(name, score) {
    let list = JSON.parse(localStorage.getItem('top100Scores') || "[]");
    let user = list.find(u => u.name === name);
    if (user) {
        if (score > user.score) user.score = score;
    } else {
        list.push({ name, score });
    }
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem('top100Scores', JSON.stringify(list.slice(0, 10)));
}

function loadScores() {
    const list = JSON.parse(localStorage.getItem('top100Scores') || "[]");
    scoreList.innerHTML = list.map((s, i) => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #333;">
            <span>${i+1}. ${s.name}</span>
            <span style="color:#2ecc71">${s.score} Puan</span>
        </div>
    `).join('') || "Liste boş bro.";
}
