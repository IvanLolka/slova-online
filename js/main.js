let currentRoomId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, на какой странице мы находимся
  const isGamePage = window.location.pathname.includes('game.html');

  if (isGamePage) {
    // Логика для game.html
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const peerId = urlParams.get('peerId');
    myId = id;
    opponentId = peerId;

    initPeer(myId);
    connectToPeer(opponentId);

    const sendWordBtn = document.getElementById('send-word');
    if (sendWordBtn) {
      sendWordBtn.addEventListener('click', () => {
        const input = document.getElementById('word-input');
        const word = input.value.trim();
        if (!word) return;

        if (isMyTurn) {
          if (isUnique(word, wordHistory) && isValidWord(word, wordHistory[wordHistory.length - 1])) {
            wordHistory.push(word);
            updateHistory(word);
            sendWord(word);
            isMyTurn = false;
            updateTurn(false);
            input.value = '';
          } else {
            alert('Неправильное слово!');
            sendGameOver();
          }
        }
      });
    }
  } else {
    // Логика для index.html
    const createBtn = document.getElementById('create-room');
    const joinBtn = document.getElementById('join-room');
    const roomIdInput = document.getElementById('room-id');
    const roomActions = document.getElementById('room-actions');
    const copyIdBtn = document.getElementById('copy-id-btn');
    const startGameBtn = document.getElementById('start-game-btn');

    if (createBtn) {
      createBtn.addEventListener('click', () => {
        currentRoomId = Math.random().toString(36).substring(2, 10);
        roomActions.style.display = 'block';
      });
    }

    if (copyIdBtn) {
      copyIdBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentRoomId).then(() => {
          alert('ID скопирован в буфер обмена!');
        });
      });
    }

    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        const peerId = Math.random().toString(36).substring(2, 10);
        window.location.href = `game.html?id=${peerId}&peerId=${currentRoomId}`;
      });
    }

    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        const id = roomIdInput.value.trim();
        if (!id) return;
        const peerId = Math.random().toString(36).substring(2, 10);
        window.location.href = `game.html?id=${peerId}&peerId=${id}`;
      });
    }
  }
});