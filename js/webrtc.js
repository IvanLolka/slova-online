let peer;
let conn;

function initPeer(id) {
  peer = new Peer(id, {
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    }
  });
  peer.on('open', () => {
    console.log('ID подключения:', peer.id);
  });
  peer.on('connection', (connection) => {
    conn = connection;
    setupConnection(conn);
  });
}
function connectToPeer(id) {
  conn = peer.connect(id);
  setupConnection(conn);
}
function setupConnection(connection) {
  connection.on('open', () => {
    document.getElementById('status').textContent = 'Соединение установлено';
    document.getElementById('word-input').disabled = false;
    document.getElementById('send-word').disabled = false;
  });
  connection.on('data', (data) => {
    handleIncomingData(data);
  });
}
function sendWord(word) {
  if (conn) {
    conn.send({ type: 'word', word });
  }
}
function sendGameOver() {
  if (conn) {
    conn.send({ type: 'gameOver' });
  }
}