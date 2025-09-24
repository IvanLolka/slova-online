let currentTurn = 'player1';
let isMyTurn = true;
let wordHistory = [];
let myId = null;
let opponentId = null;
let currentRoomId = null;

document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.getElementById('create-room');
  const joinBtn = document.getElementById('join-room');
  const roomIdInput = document.getElementById('room-id');
  if (window.location.pathname.includes('game.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const peerId = urlParams.get('peerId');
    myId = id;
    opponentId = peerId;
    initPeer(myId);
    connectToPeer(opponentId);
    document.getElementById('send-word').addEventListener('click', () => {
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
  } else {
    createBtn.addEventListener('click', () => {
      const id = Math.random().toString(36).substring(2, 10);
      const peerId = Math.random().toString(36).substring(2, 10);
      window.location.href = `game.html?id=${id}&peerId=${peerId}`;
    });
    joinBtn.addEventListener('click', () => {
      const id = roomIdInput.value.trim();
      if (!id) return;
      const peerId = id;
      window.location.href = `game.html?id=${Math.random().toString(36).substring(2, 10)}&peerId=${peerId}`;
    });
  }
});
function updateHistory(word) {
  const historyList = document.getElementById('history');
  const li = document.createElement('li');
  li.textContent = word;
  historyList.appendChild(li);
}
function updateTurn(isMy) {
  const turnElement = document.getElementById('turn');
  turnElement.textContent = isMy ? 'Ваш ход' : 'Ход соперника';
}
function handleIncomingData(data) {
  if (data.type === 'word') {
    wordHistory.push(data.word);
    updateHistory(data.word);
    isMyTurn = true;
    updateTurn(true);
  } else if (data.type === 'gameOver') {
    alert('Соперник проиграл! Вы победили!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.getElementById('create-room');
  const joinBtn = document.getElementById('join-room');
  const roomIdInput = document.getElementById('room-id');
  const roomActions = document.getElementById('room-actions');
  const copyIdBtn = document.getElementById('copy-id-btn');
  const startGameBtn = document.getElementById('start-game-btn');

  createBtn.addEventListener('click', () => {
    currentRoomId = Math.random().toString(36).substring(2, 10);
    roomActions.style.display = 'block';
  });

  copyIdBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentRoomId).then(() => {
      alert('ID скопирован в буфер обмена!');
    });
  });

  startGameBtn.addEventListener('click', () => {
    const peerId = Math.random().toString(36).substring(2, 10);
    window.location.href = `game.html?id=${peerId}&peerId=${currentRoomId}`;
  });

  joinBtn.addEventListener('click', () => {
    const id = roomIdInput.value.trim();
    if (!id) return;
    const peerId = Math.random().toString(36).substring(2, 10);
    window.location.href = `game.html?id=${peerId}&peerId=${id}`;
  });
});