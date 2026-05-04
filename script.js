// ... (üstteki değişken tanımlamaları aynı kalıyor)

// SAYFA YÜKLENDİĞİNDE KONTROL ET
window.onload = () => {
    const savedName = localStorage.getItem('registeredName');
    if (savedName) {
        usernameInput.value = savedName;
        usernameInput.readOnly = true; // Kutuyu kilitler
        usernameInput.style.opacity = "0.6"; // Kilitli olduğunu belli etmek için biraz soldurur
        usernameInput.style.cursor = "not-allowed";
    }
};

// OYNA BUTONU GÜNCELLEMESİ
document.getElementById('play-btn').onclick = () => {
    const name = usernameInput.value.trim();
    
    if (!name) {
        return alert("Bro ismini yazmadın!");
    }

    // Eğer isim daha önce kaydedilmemişse şimdi kaydet ve kilitle
    if (!localStorage.getItem('registeredName')) {
        localStorage.setItem('registeredName', name);
        usernameInput.readOnly = true;
        usernameInput.style.opacity = "0.6";
        usernameInput.style.cursor = "not-allowed";
    }

    currentPlayer = name;
    document.getElementById('player-label').textContent = "PİLOT: " + name;
    switchScreen(gameScreen);
    initGame();
};

// ... (Geri kalan fonksiyonlar: initGame, makeMove vb. aynı kalıyor)
