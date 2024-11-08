import { initSocket } from '@/utils/socket';

export async function GET(req) {
    if (!req.socket.server.io) {
        console.log('Initializing Socket.io...');
        req.socket.server.io = initSocket(req.socket.server);
    }

    return new Response(JSON.stringify({ message: 'Socket setup complete' }), { status: 200 });
}
