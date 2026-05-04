// Elementleri Seç
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const scoreScreen = document.getElementById('score-screen');
const usernameInput = document.getElementById('username');
const board = document.getElementById('game-board');
const nextNumDisplay = document.getElementById('next-number');
const scoreList = document.getElementById('score-list');

let currentNumber = 1;
let lastSelected = null;
let currentPlayer = "";

// --- SAYFA YÜKLENDİĞİNDE İSİM KONTROLÜ ---
window.addEventListener('load', () => {
    const saved = localStorage.getItem('tenOfTen_Name');
    if (saved) {
        usernameInput.value = saved;
        usernameInput.readOnly = true;
        usernameInput.style.opacity = "0.5";
        usernameInput.style.cursor = "not-allowed";
    }
});

// --- EKRAN GEÇİŞ FONKSİYONU ---
function showScreen(target) {
    menuScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    scoreScreen.classList.add('hidden');
    target.classList.remove('hidden');
}

// --- BUTON TIKLAMALARI (KESİN ÇALIŞAN YÖNTEM) ---
document.getElementById('play-btn').addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (!name) {
        alert("Bro önce bir isim yaz!");
        return;
    }
    
    // İsmi Kilitle
    if (!localStorage.getItem('tenOfTen_Name')) {
        localStorage.setItem('tenOfTen_Name', name);
        usernameInput.readOnly = true;
        usernameInput.style.opacity = "0.5";
    }

    currentPlayer = name;
    document.getElementById('player-label').innerText = "PİLOT: " + name;
    showScreen(gameScreen);
    resetGame();
});

document.getElementById('show-scores-btn').addEventListener('click', () => {
    renderLeaderboard();
    showScreen(scoreScreen);
});

document.getElementById('back-btn').addEventListener('click', () => showScreen(menuScreen));
document.getElementById('quit-btn').addEventListener('click', () => showScreen(menuScreen));
document.getElementById('reset-btn').addEventListener('click', resetGame);

// --- OYUN MANTIĞI ---
function resetGame() {
    currentNumber = 1;
    lastSelected = null;
    nextNumDisplay.innerText = "1";
    board.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.onclick = () => makeMove(i, cell);
        board.appendChild(cell);
    }
    drawHints();
}

function makeMove(index, cell) {
    const r = Math.floor(index / 10), c = index % 10;
    if (cell.classList.contains('filled')) return;

    if (currentNumber === 1 || canPlace(r, c)) {
        cell.innerText = currentNumber;
        cell.classList.add('filled');
        lastSelected = { r, c };
        
        saveScore(currentPlayer, currentNumber);
        
        if (currentNumber === 100) alert("REİS AKIYORSUN! 100 YAPILDI!");
        
        currentNumber++;
        nextNumDisplay.innerText = currentNumber;
        drawHints();
    }
}

function canPlace(r, c) {
    if (!lastSelected) return true;
    const rd = Math.abs(r - lastSelected.r);
    const cd = Math.abs(c - lastSelected.c);
    return (rd === 3 && cd === 0) || (rd === 0 && cd === 3) || (rd === 2 && cd === 2);
}

function drawHints() {
    document.querySelectorAll('.cell').forEach((cell, i) => {
        cell.classList.remove('valid-move');
        const r = Math.floor(i / 10), c = i % 10;
        if (!cell.classList.contains('filled') && canPlace(r, c)) {
            cell.classList.add('valid-move');
        }
    });
}

// --- SKOR TABLOSU ---
function saveScore(name, score) {
    let data = JSON.parse(localStorage.getItem('tenOfTen_Scores') || "[]");
    let user = data.find(x => x.name === name);
    if (user) { if (score > user.score) user.score = score; }
    else { data.push({ name, score }); }
    data.sort((a, b) => b.score - a.score);
    localStorage.setItem('tenOfTen_Scores', JSON.stringify(data.slice(0, 10)));
}

function renderLeaderboard() {
    const data = JSON.parse(localStorage.getItem('tenOfTen_Scores') || "[]");
    scoreList.innerHTML = data.map((s, i) => `
        <div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #222;">
            <span>${i+1}. ${s.name}</span>
            <span style="color:#2ecc71">${s.score} Puan</span>
        </div>
    `).join('') || "Henüz rekor yok!";
}
