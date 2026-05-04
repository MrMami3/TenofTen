const loginScreen = document.getElementById('login-screen');
const gameContainer = document.getElementById('game-container');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const board = document.getElementById('game-board');
const nextNumDisplay = document.getElementById('next-number');
const displayName = document.getElementById('display-name');

let currentNumber = 1;
let lastSelected = null;
let playerName = "";

// 1. Giriş ve Butonlar
document.getElementById('start-btn').onclick = () => {
    playerName = document.getElementById('username').value || "Anonim";
    loginScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    displayName.textContent = playerName;
    createBoard();
};

document.getElementById('leaderboard-btn').onclick = () => {
    showLeaderboard();
    leaderboardScreen.classList.remove('hidden');
};

document.getElementById('back-btn').onclick = () => {
    leaderboardScreen.classList.add('hidden');
};

// 2. Oyun Mantığı (Önceki kuralın aynısı)
function createBoard() {
    board.innerHTML = '';
    currentNumber = 1;
    lastSelected = null;
    nextNumDisplay.textContent = "1";
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.onclick = () => handleMove(i, cell);
        board.appendChild(cell);
    }
}

function handleMove(index, cell) {
    const r = Math.floor(index / 10);
    const c = index % 10;

    if (cell.classList.contains('filled')) return;

    if (currentNumber === 1 || isValidMove(r, c)) {
        cell.textContent = currentNumber;
        cell.classList.add('filled');
        lastSelected = { r, c };
        
        if (currentNumber === 100) {
            saveScore(playerName, 100);
            alert("EFSANESİN BRO! 100 YAPtin!");
        }

        currentNumber++;
        nextNumDisplay.textContent = currentNumber;
        showValidMoves();
    }
}

function isValidMove(r, c) {
    if (!lastSelected) return true;
    const rd = Math.abs(r - lastSelected.r);
    const cd = Math.abs(c - lastSelected.c);
    return ((rd === 3 && cd === 0) || (rd === 0 && cd === 3) || (rd === 2 && cd === 2));
}

function showValidMoves() {
    document.querySelectorAll('.cell').forEach((cell, i) => {
        cell.classList.remove('valid-move');
        const r = Math.floor(i / 10), c = i % 10;
        if (!cell.classList.contains('filled') && isValidMove(r, c)) {
            cell.classList.add('valid-move');
        }
    });
}

// 3. Sıralama Sistemi (Local Storage kullanarak tarayıcıya kaydeder)
function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem('scores') || "[]");
    scores.push({name, score, date: new Date().toLocaleDateString()});
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('scores', JSON.stringify(scores.slice(0, 10)));
}

function showLeaderboard() {
    const list = document.getElementById('score-list');
    const scores = JSON.parse(localStorage.getItem('scores') || "[]");
    list.innerHTML = scores.map(s => `<li>${s.name}: ${s.score}</li>`).join('') || "Henüz skor yok bro!";
}

document.getElementById('reset-btn').onclick = createBoard;
