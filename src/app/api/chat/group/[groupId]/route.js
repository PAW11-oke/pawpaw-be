import { connectToDatabase } from '@/utils/dbConfig';
import Message from '@/models/messageModel';
import ChatGroup from '@/models/chatGroupModel';

export async function POST(req, { params }) {
    await connectToDatabase();
    const { groupId } = params;
    const { userId, content, files } = await req.json();

    // Cek apakah grup ada
    const group = await ChatGroup.findById(groupId);
    if (!group) {
        return NextResponse.json({ message: 'Chat group not found' }, { status: 404 });
    }

    // Buat pesan baru
    const newMessage = new Message({
        groupId, // Pastikan groupId disimpan dalam pesan
        userId,
        content,
        files
    });

    await newMessage.save();

    return NextResponse.json({ message: 'Message created', messageData: newMessage }, { status: 201 });
}

// Untuk edit message
export async function PATCH(req, { params }) {
    await connectToDatabase();
    const { messageId } = params;
    const { content } = await req.json();

    const message = await Message.findById(messageId);
    if (!message) {
        return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    message.content = content;
    message.editedAt = Date.now();

    await message.save();

    return NextResponse.json({ message: 'Message updated', messageData: message }, { status: 200 });
}

// Ambil pesan berdasarkan groupId
export async function GET(req, { params }) {
    await connectToDatabase();
    const { groupId } = params;

    try {
        const messages = await Message.find({ groupId }).populate('userId', 'name');
        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
