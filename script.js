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

// Buton Olayları
document.getElementById('play-btn').onclick = () => {
    if (usernameInput.value.trim() === "") {
        alert("Önce ismini yazmalısın bro!");
        return;
    }
    currentPlayer = usernameInput.value;
    document.getElementById('player-label').textContent = "Oyuncu: " + currentPlayer;
    showScreen(gameScreen);
    startGame();
};

document.getElementById('show-scores-btn').onclick = () => {
    renderScores();
    showScreen(scoreScreen);
};

document.getElementById('back-btn').onclick = () => showScreen(menuScreen);
document.getElementById('quit-btn').onclick = () => showScreen(menuScreen);

function showScreen(screen) {
    [menuScreen, gameScreen, scoreScreen].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

// Oyun Fonksiyonları
function startGame() {
    currentNumber = 1;
    lastSelected = null;
    nextNumDisplay.textContent = "1";
    board.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.onclick = () => handleMove(i, cell);
        board.appendChild(cell);
    }
    updateBoardUI();
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
            alert("Tebrikler " + currentPlayer + "! 100'e ulaştın!");
        }

        // Oyunu her harekette kaydet (puan = ulaştığı son sayı)
        saveScore(currentPlayer, currentNumber);
        
        currentNumber++;
        nextNumDisplay.textContent = currentNumber;
        updateBoardUI();
    }
}

function isValidMove(r, c) {
    if (!lastSelected) return true;
    const rd = Math.abs(r - lastSelected.r);
    const cd = Math.abs(c - lastSelected.c);
    
    const straight = (rd === 3 && cd === 0) || (rd === 0 && cd === 3);
    const diagonal = (rd === 2 && cd === 2);
    return straight || diagonal;
}

function updateBoardUI() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        cell.classList.remove('valid-move');
        const r = Math.floor(i / 10), c = i % 10;
        if (!cell.classList.contains('filled') && isValidMove(r, c)) {
            cell.classList.add('valid-move');
        }
    });
}

// Skor Kaydetme ve Listeleme
function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem('gameScores') || "[]");
    // Aynı isim varsa ve puanı daha yüksekse güncelle
    const existingIndex = scores.findIndex(s => s.name === name);
    if (existingIndex > -1) {
        if (score > scores[existingIndex].score) scores[existingIndex].score = score;
    } else {
        scores.push({ name, score });
    }
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('gameScores', JSON.stringify(scores.slice(0, 10)));
}

function renderScores() {
    const scores = JSON.parse(localStorage.getItem('gameScores') || "[]");
    scoreList.innerHTML = scores.map((s, index) => `
        <div class="score-item">
            <span>${index + 1}. ${s.name}</span>
            <span>${s.score} Puan</span>
        </div>
    `).join('') || "<p>Henüz kimse oynamadı bro!</p>";
}
