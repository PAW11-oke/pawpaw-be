import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
                methods: ['GET', 'POST']
            }
        });

        io.on('sendMessage', async ({ groupId, userId, content }) => {
            const user = await User.findById(userId);
            const message = {
                groupId,
                userId,
                content,
                profilePicture: user.profilePicture, // Include profile picture URL
                createdAt: new Date(),
            };
            await new Message(message).save();
        
            io.to(groupId).emit('receiveMessage', message);  // Emit ke semua user dalam grup
        });
        
    }
    return io;
};
