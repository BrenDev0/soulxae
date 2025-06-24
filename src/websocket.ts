import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import WebSocketService from './modules/webSocket/WebSocketService';

const PORT = parseInt(process.env.PORT || '4000', 10);

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const wsService = new WebSocketService();

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/ws') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws, req) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const conversationId = url.searchParams.get('conversationId');

  if (!conversationId) {
    ws.close(1008, 'Missing conversationId');
    return;
  }

  wsService.addConnection(conversationId, ws);
});

