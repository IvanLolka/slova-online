document.addEventListener('DOMContentLoaded', () => {
  const isGamePage = window.location.pathname.includes('game.html');

  if (isGamePage) {
    // На странице игры: ожидаем параметры:
    // ?id=<мой peer id>&opponentId=<peer id соперника (только для подключающегося) >
    const urlParams = new URLSearchParams(window.location.search);
    const myId = urlParams.get('id');
    const opponentId = urlParams.get('opponentId'); // раньше называли peerId — переименовали для ясности

    if (!myId) {
      console.error('Не передан параметр id (peer id).');
      document.getElementById('status').textContent = 'Ошибка: некорректный ID.';
      return;
    }

    // Инициализируем свой Peer. (webrtc.js содержит initPeer, connectToPeer)
    initPeer(myId);

    // Подождём открытия peer и только потом попытка подключения
    // peer — глобальная переменная из webrtc.js
    if (typeof peer !== 'undefined') {
      peer.on('open', () => {
        console.log('Peer открыт, мой ID =', peer.id);
        // Если есть opponentId — пробуем подключиться к нему (обычно это присоединяющийся клиент)
        if (opponentId && opponentId !== peer.id) {
          connectToPeer(opponentId);
        } else {
          // Ожидаем входящих подключений (host)
          document.getElementById('status').textContent = 'Ожидание соперника...';
        }
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        document.getElementById('status').textContent = 'Ошибка соединения: ' + (err && err.type ? err.type : err);
      });
    } else {
      console.error('Переменная peer не определена (порядок подключения скриптов?).');
    }

    // UI — кнопка отправки слова (как было), включится при установке соединения
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
    // Страница создания/входа в комнату
    const createBtn = document.getElementById('create-room');
    const joinBtn = document.getElementById('join-room');
    const roomIdInput = document.getElementById('room-id');
    const roomActions = document.getElementById('room-actions');
    const copyIdBtn = document.getElementById('copy-id-btn');
    const startGameBtn = document.getElementById('start-game-btn');

    let currentRoomId = null; // будет служить как peer id хоста

    if (createBtn) {
      createBtn.addEventListener('click', () => {
        // Генерируем ID комнаты и сразу используем его как peerId хоста
        currentRoomId = Math.random().toString(36).substring(2, 10);
        roomActions.style.display = 'block';
        // Покажем ID (можно улучшить — вставить в DOM)
        alert('ID комнаты: ' + currentRoomId + '\nСкопируйте и отправьте игроку.');
      });
    }

    if (copyIdBtn) {
      copyIdBtn.addEventListener('click', () => {
        if (!currentRoomId) return alert('Сначала создайте комнату.');
        navigator.clipboard.writeText(currentRoomId).then(() => {
          alert('ID скопирован в буфер обмена!');
        });
      });
    }

    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        if (!currentRoomId) return alert('Сначала создайте комнату.');
        // Хост открывает страницу игры со своим peer id. Причём opponentId не передаём — он будет ждать входящих.
        window.location.href = `game.html?id=${currentRoomId}`;
      });
    }

    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        const id = roomIdInput.value.trim(); // ID комнаты (peer id хоста)
        if (!id) return alert('Введите ID комнаты.');
        // У подключающегося — свой peer id генерируем, и передаём opponentId=ID хозяина комнаты
        const myPeerId = Math.random().toString(36).substring(2, 10);
        window.location.href = `game.html?id=${myPeerId}&opponentId=${id}`;
      });
    }
  }
});
