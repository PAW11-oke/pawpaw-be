import { connectToDatabase } from '@/utils/dbConfig';
import GroupChat from '@/models/chatGroupModel';

export async function GET() {
    await connectToDatabase();

    try {
        const groups = await GroupChat.find();
        return new Response(JSON.stringify(groups), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
