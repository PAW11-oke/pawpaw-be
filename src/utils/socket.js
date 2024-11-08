// utils/socket.js
import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: process.env.NEXTAUTH_URL,
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            socket.on('joinGroup', (groupId) => {
                socket.join(groupId);
                console.log(`User ${socket.id} joined group ${groupId}`);
            });

            socket.on('sendMessage', ({ groupId, userId, content }) => {
                const message = { groupId, userId, content, createdAt: new Date() };
                io.to(groupId).emit('receiveMessage', message);  // Emit ke semua user dalam grup
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }
    return io;
};
