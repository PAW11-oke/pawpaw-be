import { uploadToCloudinary } from '@/utils/cloudinaryConfig';
import { connectToDatabase } from '@/utils/dbConfig';
import User from '@/models/userModel';
import { authMiddleware } from '@/utils/authMiddleware';

export async function POST(req) {
    await connectToDatabase();

    // Verifikasi autentikasi menggunakan middleware
    const authResult = await authMiddleware(req);

    // Jika autentikasi gagal, kembalikan respons 401
    if (authResult && authResult.status === 401) {
        return authResult;
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // Misalnya, 'profile', 'pet', 'chat'

    // Pastikan file dan tipe telah diterima
    if (!file || !type) {
        return new Response(JSON.stringify({ error: 'File and type are required.' }), { status: 400 });
    }

    try {
        // Upload file ke Cloudinary menggunakan utility uploadToCloudinary
        const uploadResult = await uploadToCloudinary(file, type);

        // Jika tipe file adalah 'profile', update foto profil pengguna
        if (type === 'profile') {
            const userId = req.userId;
            // Temukan dan perbarui profil pengguna dengan URL foto profil baru
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePicture: uploadResult.secure_url }, // Simpan URL foto di database
                { new: true }
            );

            // Jika pengguna tidak ditemukan, kembalikan respons 404
            if (!updatedUser) {
                return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404 });
            }

            // Kembalikan URL foto profil yang telah diperbarui
            return new Response(JSON.stringify({ profilePicture: updatedUser.profilePicture }), { status: 200 });
        }

        return new Response(JSON.stringify({ url: uploadResult.secure_url }), { status: 200 });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return new Response(JSON.stringify({ error: 'Failed to upload image.' }), { status: 500 });
    }
}



export async function GET(req) {
    await connectToDatabase();
    const authResult = await authMiddleware(req);

    if (authResult && authResult.status === 401) {
        return authResult;
    }

    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user || !user.profilePicture) {
            return new Response(JSON.stringify({ error: 'Profile picture not found.' }), { status: 404 });
        }

        return new Response(JSON.stringify({ profilePicture: user.profilePicture }), { status: 200 });
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch profile picture.' }), { status: 500 });
    }
}
