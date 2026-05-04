/* Önceki stillere ek olarak şunları ekle veya değiştir */
body {
    background-color: #1a1a1a;
    color: white;
    font-family: 'Segoe UI', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal {
    background: #333;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 0 20px #2ecc71;
}

input {
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: none;
    margin-bottom: 10px;
    display: block;
    width: 200px;
}

.hidden { display: none !important; }

button {
    padding: 10px 20px;
    margin: 5px;
    background-color: #2ecc71;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

#reset-btn { background-color: #e74c3c; }
#leaderboard-btn { background-color: #3498db; }

/* Grid ve Cell stilleri aynı kalabilir */
.grid { display: grid; grid-template-columns: repeat(10, 35px); gap: 4px; }
.cell { width: 35px; height: 35px; background: #444; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.cell.filled { background: #2ecc71; }
.cell.valid-move { background: #3498db; cursor: pointer; }
