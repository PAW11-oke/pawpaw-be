import { connectToDatabase } from '@/utils/dbConfig';
import Message from '@/models/messageModel';

export async function POST(req, { params }) {
    await connectToDatabase();
    const { messageId } = params;
    const { userId, type } = await req.json();

    const allowedReactions = ['like', 'love', 'haha']; // Batasan reaksi
    if (!allowedReactions.includes(type)) {
        return NextResponse.json({ message: 'Invalid reaction type' }, { status: 400 });
    }

    const message = await Message.findById(messageId);
    if (!message) {
        return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    // Tambah reaksi ke pesan
    const reaction = { userId, type };
    message.reactions.push(reaction);

    await message.save();

    return NextResponse.json({ message: 'Reaction added', messageData: message }, { status: 200 });
}
