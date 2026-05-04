// Global Değişkenler
let currentNumber = 1;
let lastSelected = null;
let currentPlayer = "";

// Sayfa Yüklendiğinde İsim Kilidini Kontrol Et
window.onload = function() {
    const savedName = localStorage.getItem('tenOfTen_Name');
    const input = document.getElementById('username');
    if (savedName) {
        input.value = savedName;
        input.readOnly = true;
        input.style.opacity = "0.5";
    }
};

// --- EKRAN YÖNETİMİ ---
function showScreen(screenId) {
    console.log("Ekran değiştiriliyor: " + screenId); // Çalışıp çalışmadığını konsoldan gör
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('score-screen').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}

// --- BUTON FONKSİYONLARI ---
function playGame() {
    const input = document.getElementById('username');
    const name = input.value.trim();
    
    if (!name) {
        alert("Bro önce ismini yaz!");
        return;
    }

    // İsim Kaydet ve Kilitle
    if (!localStorage.getItem('tenOfTen_Name')) {
        localStorage.setItem('tenOfTen_Name', name);
        input.readOnly = true;
        input.style.opacity = "0.5";
    }

    currentPlayer = name;
    document.getElementById('player-label').innerText = "PİLOT: " + name;
    showScreen('game-screen');
    resetGame();
}

function openLeaderboard() {
    renderScores();
    showScreen('score-screen');
}

function goToMenu() {
    showScreen('menu-screen');
}

// --- OYUN MANTIĞI ---
function resetGame() {
    currentNumber = 1;
    lastSelected = null;
    document.getElementById('next-number').innerText = "1";
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.onclick = function() { makeMove(i, cell); };
        board.appendChild(cell);
    }
    updateHints();
}

function makeMove(index, cell) {
    const r = Math.floor(index / 10);
    const c = index % 10;

    if (cell.classList.contains('filled')) return;

    if (currentNumber === 1 || isValidMove(r, c)) {
        cell.innerText = currentNumber;
        cell.classList.add('filled');
        lastSelected = { r, c };
        
        saveScore(currentPlayer, currentNumber);
        
        if (currentNumber === 100) alert("EFSANESİN! 100!");
        
        currentNumber++;
        document.getElementById('next-number').innerText = currentNumber;
        updateHints();
    }
}

function isValidMove(r, c) {
    if (!lastSelected) return true;
    const rd = Math.abs(r - lastSelected.r);
    const cd = Math.abs(c - lastSelected.c);
    // Düz 3 birim veya Çapraz 2 birim
    return (rd === 3 && cd === 0) || (rd === 0 && cd === 3) || (rd === 2 && cd === 2);
}

function updateHints() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        cell.classList.remove('valid-move');
        const r = Math.floor(i / 10), c = i % 10;
        if (!cell.classList.contains('filled') && isValidMove(r, c)) {
            cell.classList.add('valid-move');
        }
    });
}

// --- SKOR TABLOSU ---
function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem('tenOfTen_Scores') || "[]");
    let userIndex = scores.findIndex(s => s.name === name);
    if (userIndex > -1) {
        if (score > scores[userIndex].score) scores[userIndex].score = score;
    } else {
        scores.push({ name, score });
    }
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('tenOfTen_Scores', JSON.stringify(scores.slice(0, 10)));
}

function renderScores() {
    const scores = JSON.parse(localStorage.getItem('tenOfTen_Scores') || "[]");
    const list = document.getElementById('score-list');
    list.innerHTML = scores.map((s, i) => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #333;">
            <span>${i+1}. ${s.name}</span>
            <span style="color:#2ecc71">${s.score} Puan</span>
        </div>
    `).join('') || "Henüz rekor yok bro!";
}
