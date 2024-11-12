// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
    if (!res.socket.server.io) {
        // Buat instance baru Server Socket.IO jika belum ada
        const io = new Server(res.socket.server, {
        path: "/api/socket", // Path untuk Socket.IO
        addTrailingSlash: false,
        });
        res.socket.server.io = io;

        io.on("connection", (socket) => {
        console.log("User connected");

        // Mendengarkan event 'sendMessage' dan kirim ke semua client lain
        socket.on("sendMessage", (message) => {
            socket.broadcast.emit("newMessage", message);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
        });
    }

    res.end();
}
