"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
class WebSocketService {
    constructor() {
        this.connections = new Map();
    }
    addConnection(connectionId, ws) {
        if (!this.connections.has(connectionId)) {
            this.connections.set(connectionId, new Set());
        }
        this.connections.get(connectionId).add(ws);
        ws.on('close', () => {
            this.removeConnection(connectionId, ws);
        });
    }
    removeConnection(connectionId, ws) {
        const set = this.connections.get(connectionId);
        if (!set)
            return;
        set.delete(ws);
        if (set.size === 0) {
            this.connections.delete(connectionId);
        }
    }
    broadcast(connectionId, data) {
        const set = this.connections.get(connectionId);
        if (!set)
            return;
        const message = JSON.stringify(data);
        for (const ws of set) {
            if (ws.readyState === ws_1.WebSocket.OPEN) {
                ws.send(message);
            }
        }
    }
}
exports.default = WebSocketService;
