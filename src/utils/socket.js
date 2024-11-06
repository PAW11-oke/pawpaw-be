// utils/socket.js
import { Server } from 'socket.io';
import Message from '@/models/messageModel';
import ChatGroup from '@/models/chatGroupModel';

let io;

export const initSocket = (server) => {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: process.env.NEXTAUTH_URL,
                methods: ['GET', 'POST'],
            },
        });

        io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            socket.on('joinGroup', (groupId) => {
                socket.join(groupId);
                console.log(`User ${socket.id} joined group ${groupId}`);
            });

            socket.on('sendMessage', async ({ groupId, userId, content, files }) => {
                try {
                    const newMessage = new Message({ groupId, userId, content, files });
                    await newMessage.save();
                    io.to(groupId).emit('receiveMessage', newMessage);
                } catch (error) {
                    console.error('Error saving message:', error);
                }
            });

            socket.on('sendReaction', async ({ messageId, userId, type }) => {
                try {
                    const message = await Message.findById(messageId);
                    if (message) {
                        message.reactions.push({ userId, type });
                        await message.save();
                        io.to(message.groupId).emit('receiveReaction', message);
                    }
                } catch (error) {
                    console.error('Error sending reaction:', error);
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }
    return io;
};

export const getSocket = () => {
    if (!io) {
        throw new Error('Socket not initialized');
    }
    return io;
};
