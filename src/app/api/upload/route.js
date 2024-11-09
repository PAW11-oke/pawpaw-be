import { uploadToCloudinary } from '@/utils/cloudinaryConfig';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded.' }), { status: 400 });
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({ error: 'Invalid file type. Only images are allowed.' }), { status: 400 });
        }

        // Konversi file Blob ke Buffer
        const fileBuffer = await file.arrayBuffer();
        
        // Panggil uploadToCloudinary dengan fileBuffer
        const imageUrl = await uploadToCloudinary(Buffer.from(fileBuffer));

        return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
    } catch (error) {
        console.error('Error in upload route:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
