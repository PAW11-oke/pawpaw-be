import Message from '@/models/messageModel';
import { connectToDatabase } from '@/utils/dbConfig';

export async function GET(req, context) {
    await connectToDatabase();

    // Menggunakan await untuk mendapatkan params
    const { groupId } = await context.params;  // Pastikan params di-`await`
    console.log("Fetching messages for group:", );

    try {
        // Ambil semua pesan dari grup yang dipilih, diurutkan berdasarkan waktu
        const messages = await Message.find({ groupId }).sort({ createdAt: 1 });

        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return new Response("Failed to fetch messages", { status: 500 });
    }
}

export async function POST(req, context) {
    await connectToDatabase();

    const { messageId } = context.params;
    const { userId, reactionType } = await req.json();

    if (!reactionType || !userId) {
        return new Response("User and reaction type required", { status: 400 });
    }

    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return new Response("Message not found", { status: 404 });
        }

        // Cek jika reaksi user sudah ada dan update atau tambahkan reaksi baru
        const existingReactionIndex = message.reactions.findIndex(reaction => reaction.userId.toString() === userId);
        if (existingReactionIndex > -1) {
            message.reactions[existingReactionIndex].type = reactionType;
        } else {
            message.reactions.push({ userId, type: reactionType });
        }

        await message.save();
        return new Response(JSON.stringify(message), { status: 200 });
    } catch (error) {
        console.error("Error adding reaction:", error);
        return new Response("Failed to add reaction", { status: 500 });
    }
}

