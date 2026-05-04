const board = document.getElementById('game-board');
const nextNumDisplay = document.getElementById('next-number');
const resetBtn = document.getElementById('reset-btn');

let currentNumber = 1;
let lastSelected = null; // {r, c}

// 10x10 Board oluşturma
function createBoard() {
    board.innerHTML = '';
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handleMove(r, c, cell));
            board.appendChild(cell);
        }
    }
}

function handleMove(r, c, cell) {
    if (cell.classList.contains('filled')) return;

    if (currentNumber === 1 || isValidMove(r, c)) {
        cell.textContent = currentNumber;
        cell.classList.add('filled');
        cell.classList.remove('valid-move');
        
        lastSelected = { r, c };
        currentNumber++;
        nextNumDisplay.textContent = currentNumber;
        
        showValidMoves();
        
        if (currentNumber > 100) alert("Tebrikler! Oyunu bitirdin!");
    }
}

function isValidMove(r, c) {
    if (!lastSelected) return true;

    const rowDiff = Math.abs(r - lastSelected.r);
    const colDiff = Math.abs(c - lastSelected.c);

    // Kural: Yatay/Dikey 3 birim (2 blok atla)
    const straightMove = (rowDiff === 3 && colDiff === 0) || (rowDiff === 0 && colDiff === 3);
    // Kural: Çapraz 2 birim (1 blok atla)
    const diagonalMove = (rowDiff === 2 && colDiff === 2);

    return straightMove || diagonalMove;
}

function showValidMoves() {
    // Önceki işaretleri temizle
    document.querySelectorAll('.valid-move').forEach(el => el.classList.remove('valid-move'));

    // Gidilebilecek kareleri işaretle
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        if (!cell.classList.contains('filled') && isValidMove(r, c)) {
            cell.classList.add('valid-move');
        }
    });
}

resetBtn.addEventListener('click', () => {
    currentNumber = 1;
    lastSelected = null;
    nextNumDisplay.textContent = "1";
    createBoard();
});

createBoard();
