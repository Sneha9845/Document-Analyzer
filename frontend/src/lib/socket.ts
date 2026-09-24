export class AnalysisSocket {
    private socket: WebSocket | null = null;
    private url: string;

    constructor(fileId: string) {
        let baseUrl;
        if (typeof window !== 'undefined') {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            baseUrl = `${protocol}//${window.location.host}`;
        } else {
            baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
        }
        this.url = `${baseUrl}/ws/analyze/${fileId}`;
    }

    connect(onMessage: (data: any) => void) {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("Connected to Analysis Stream");
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        this.socket.onclose = () => {
            console.log("Analysis Stream Finished");
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
