import { connectToDatabase } from '@/utils/db';
import { uploadImage } from '@/utils/uploadImage';

export async function POST(req) {
    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
        return new Response(JSON.stringify({ error: 'No file uploaded.' }), { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({ error: 'Invalid file type. Only images are allowed.' }), { status: 400 });
    }

    try {
        // Mengunggah gambar menggunakan fungsi uploadImage
        const imageUrl = await uploadImage(file);
        return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
