import Message from '@/models/messageModel';
import { connectToDatabase } from '@/utils/dbConfig';

export async function GET(req, context) {
    await connectToDatabase();

    // Menggunakan await untuk mendapatkan params
    const { groupId } = await context.params;  // Pastikan params di-`await`

    try {
        // Ambil semua pesan dari grup yang dipilih, diurutkan berdasarkan waktu
        const messages = await Message.find({ groupId }).sort({ createdAt: 1 });

        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return new Response("Failed to fetch messages", { status: 500 });
    }
}
