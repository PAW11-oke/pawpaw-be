import petCategory from '@/models/petCategoryModel';
import { connectToDatabase } from '@/utils/dbConfig';

export async function GET() {
    await connectToDatabase();
    try {
        const groups = await petCategory.find();
        return new Response(JSON.stringify(groups), { status: 200 });
    } catch (error) {
        console.error("Error fetching groups:", error);
        return new Response("Failed to fetch groups", { status: 500 });
    }
}