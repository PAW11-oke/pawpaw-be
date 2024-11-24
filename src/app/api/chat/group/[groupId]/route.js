import { connectToDatabase } from '@/utils/dbConfig';
import Message from '@/models/messageModel';
import mongoose from 'mongoose';
import { authMiddleware } from '@/utils/authMiddleware';

export async function POST(req, context) {
    await connectToDatabase();

    // Menjalankan middleware untuk autentikasi
    const authResult = await authMiddleware(req);
    if (!authResult || authResult.status === 401) {
        return new Response("Unauthorized", { status: 401 }); 
    }

    const { groupId } = await context.params;
    const { content, replyToMessageId } = await req.json();

    if (!content) {
        return new Response("Content is required", { status: 400 });
    }
    
    try {
        const newMessage = new Message({
            groupId: new mongoose.Types.ObjectId(groupId),
            userId: req.userId,  // Pastikan userId di-set oleh middleware
            content: content,
            createdAt: new Date(),
            replies: replyToMessageId ? [replyToMessageId] : []
        });

        console.log("Sending message:", newMessage);

        await newMessage.save();

        return new Response(JSON.stringify(newMessage), { status: 201 });
    } catch (error) {
        console.error("Error sending message:", error.message);  // Memperbaiki kesalahan ketik
        return new Response("Failed to send message", { status: 500 });
    }
}
