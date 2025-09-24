let currentRoomId = null;
let myId = null;
let opponentId = null;

document.addEventListener('DOMContentLoaded', () => {
  const isGamePage = window.location.pathname.includes('game.html');

  if (isGamePage) {
    const urlParams = new URLSearchParams(window.location.search);
    myId = urlParams.get('id');
    opponentId = urlParams.get('peerId');

    initPeer(myId);
    connectToPeer(opponentId);
  } else {
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
        const myPeerId = Math.random().toString(36).substring(2, 10);
        window.location.href = `game.html?id=${myPeerId}&peerId=${currentRoomId}`;
      });
    }

    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        const peerId = roomIdInput.value.trim(); // ID, который ввёл игрок B
        if (!peerId) return;
        const myPeerId = Math.random().toString(36).substring(2, 10);
        window.location.href = `game.html?id=${myPeerId}&peerId=${peerId}`;
      });
    }
  }
});