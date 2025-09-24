// в начале файла уже должно быть: let peer; let conn;

function initPeer(id) {
  peer = new Peer(id, {
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    }
  });

  peer.on('open', () => {
    console.log('Мой ID (peer.open):', peer.id);
  });

  peer.on('connection', (connection) => {
    console.log('Получено входящее соединение от', connection.peer);
    conn = connection;
    setupConnection(conn);
  });

  peer.on('error', (err) => {
    console.error('PeerJS error:', err);
  });

  peer.on('disconnected', () => {
    console.warn('Peer disconnected');
  });
}

function connectToPeer(id) {
  console.log('Подключаюсь к:', id);
  try {
    conn = peer.connect(id, { reliable: true });
    setupConnection(conn);
  } catch (e) {
    console.error('Ошибка при connect:', e);
  }
}

function setupConnection(connection) {
  connection.on('open', () => {
    console.log('Соединение установлено с', connection.peer);
    const statusElement = document.getElementById('status');
    if (statusElement) statusElement.textContent = 'Соединение установлено';
    const input = document.getElementById('word-input');
    const send = document.getElementById('send-word');
    if (input) input.disabled = false;
    if (send) send.disabled = false;
  });

  connection.on('data', (data) => {
    console.log('Пришли данные:', data);
    handleIncomingData(data);
  });

  connection.on('close', () => {
    console.log('Соединение закрыто');
    const statusElement = document.getElementById('status');
    if (statusElement) statusElement.textContent = 'Соединение закрыто';
  });

  connection.on('error', (err) => {
    console.error('Connection error:', err);
  });
}
