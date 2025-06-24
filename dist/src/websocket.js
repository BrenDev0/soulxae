"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const ws_1 = require("ws");
const WebSocketService_1 = __importDefault(require("./modules/webSocket/WebSocketService"));
const PORT = parseInt(process.env.PORT || '4000', 10);
const server = (0, http_1.createServer)();
const wss = new ws_1.WebSocketServer({ noServer: true });
const wsService = new WebSocketService_1.default();
server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    if (pathname === '/ws') {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    }
    else {
        socket.destroy();
    }
});
wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const conversationId = url.searchParams.get('conversationId');
    if (!conversationId) {
        ws.close(1008, 'Missing conversationId');
        return;
    }
    wsService.addConnection(conversationId, ws);
});
