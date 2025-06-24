import { WebSocket } from 'ws';

export default class WebSocketService {
    private connections: Map<string, Set<WebSocket>>;

    constructor() {
        this.connections = new Map();
    }

    addConnection(connectionId: string, ws: WebSocket) {
        if (!this.connections.has(connectionId)) {
            this.connections.set(connectionId, new Set());
        }

        this.connections.get(connectionId)!.add(ws);

        ws.on('close', () => {
            this.removeConnection(connectionId, ws);
        });
    }

    private removeConnection(connectionId: string, ws: WebSocket) {
        const set = this.connections.get(connectionId);
        if (!set) return;

        set.delete(ws);
        if (set.size === 0) {
            this.connections.delete(connectionId);
        }
    }

    broadcast(connectionId: string, data: any) {
        const set = this.connections.get(connectionId);
        if (!set) return;

        const message = JSON.stringify(data);

        for (const ws of set) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(message);
            }
        }
    }
}
