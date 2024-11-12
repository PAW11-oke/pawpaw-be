// pages/api/socket.js
import { Server } from "socket.io";
import { connectToDatabase } from "@/utils/dbConfig";
import Message from "@/models/messageModel"; // Sesuaikan dengan struktur modelmu

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log("Initializing Socket.IO server...");
        const io = new Server(res.socket.server, {
            cors: {
                origin: "http://localhost:3000", // Ganti sesuai URL frontend kamu
                methods: ["GET", "POST"],
            },
        });
        
        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("joinGroup", (groupId) => {
                socket.join(groupId);
                console.log(`User ${socket.id} joined group ${groupId}`);
            });

            socket.on("sendMessage", async (data) => {
                try {
                    await connectToDatabase();

                    const newMessage = new Message({
                        groupId: data.groupId,
                        userId: data.userId,
                        content: data.content,
                        createdAt: new Date(),
                    });
                    await newMessage.save();

                    // Broadcast to all users in the group
                    io.to(data.groupId).emit("receiveMessage", newMessage);
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
};

export default ioHandler;
