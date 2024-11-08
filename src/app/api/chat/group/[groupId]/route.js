import { connectToDatabase } from '@/utils/dbConfig';
import Message from '@/models/messageModel';
import mongoose from 'mongoose';
import { authMiddleware } from '@/utils/authMiddleware';

export async function POST(req, context) {
    await connectToDatabase();

    const authResult = await authMiddleware(req);
    if (authResult && authResult.status === 401) {
        return authResult; 
    }

    const { groupId } = context.params;
    const { content } = await req.json();

    if (!content) {
        return new Response("Content is required", { status: 400 });
    }

    try {
        const newMessage = new Message({
            groupId: new mongoose.Types.ObjectId(groupId),
            userId: req.userId,  // Use userId from the request object
            content: content,
            createdAt: new Date()
        });

        await newMessage.save();

        return new Response(JSON.stringify(newMessage), { status: 201 });
    } catch (error) {
        console.error("Error sendix`ng message:", error.message);
        return new Response("Failed to send message", { status: 500 });
    }
}
