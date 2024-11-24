import { uploadToCloudinary } from '@/utils/cloudinaryConfig';
import { connectToDatabase } from '@/utils/dbConfig';
import User from '@/models/userModel';
import { authMiddleware } from '@/utils/authMiddleware';
import ChatMessage from '@/models/messageModel'; 
import Pet from '@/models/petModel'; 

// fetch '/api/upload' pake formData
export async function POST(req) {
    await connectToDatabase();

    // Autentikasi
    const authResult = await authMiddleware(req);
    if (authResult && authResult.status === 401) {
        return authResult;
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // 'profile', 'pet', 'chat'
    const id = formData.get('id'); // ID pet atau chat

    // Validasi input
    if (!file || !type || !id) {
        return new Response(
            JSON.stringify({ error: 'File, type, and ID are required.' }),
            { status: 400 }
        );
    }

    try {
        // Upload ke Cloudinary
        const uploadResult = await uploadToCloudinary(file, type);

        if (type === 'profile') {
            // Update foto profil pengguna
            const userId = req.userId;
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePicture: uploadResult.secure_url },
                { new: true }
            );

            if (!updatedUser) {
                return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404 });
            }

            return new Response(
                JSON.stringify({ profilePicture: updatedUser.profilePicture }),
                { status: 200 }
            );
        }

        if (type === 'pet') {
            // Update foto pet berdasarkan ID pet
            const updatedPet = await Pet.findByIdAndUpdate(
                id,
                { photo: uploadResult.secure_url },
                { new: true }
            );

            if (!updatedPet) {
                return new Response(JSON.stringify({ error: 'Pet not found.' }), { status: 404 });
            }

            return new Response(
                JSON.stringify({ petPhoto: updatedPet.photo }),
                { status: 200 }
            );
        }

        if (type === 'chat') {
            // Tambahkan gambar ke pesan chat berdasarkan ID pesan chat
            const updatedChat = await ChatMessage.findByIdAndUpdate(
                id,
                { fileUrl: uploadResult.secure_url },
                { new: true }
            );

            if (!updatedChat) {
                return new Response(JSON.stringify({ error: 'Chat not found.' }), { status: 404 });
            }

            return new Response(
                JSON.stringify({ chatFile: updatedChat.fileUrl }),
                { status: 200 }
            );
        }

        return new Response(JSON.stringify({ url: uploadResult.secure_url }), { status: 200 });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to upload image.' }),
            { status: 500 }
        );
    }
}

// fetch `/api/images?type=${type}&id=${id}`
export async function GET(req) {
    await connectToDatabase();
    
        // Autentikasi
        const authResult = await authMiddleware(req);
        if (authResult && authResult.status === 401) {
        return authResult;
        }
    
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'profile', 'pet', 'chat'
        const id = searchParams.get('id'); // ID pengguna/pet/chat yang relevan
    
        if (!type || !id) {
        return new Response(JSON.stringify({ error: 'Type and ID are required.' }), { status: 400 });
        }
    
        try {
        let imageUrl = null;
    
        if (type === 'profile') {
            const user = await User.findById(id);
            if (!user || !user.profilePicture) {
            return new Response(JSON.stringify({ error: 'Profile picture not found.' }), { status: 404 });
            }
            imageUrl = user.profilePicture;
        } else if (type === 'pet') {
            const pet = await Pet.findById(id);
            if (!pet || !pet.photo) {
            return new Response(JSON.stringify({ error: 'Pet photo not found.' }), { status: 404 });
            }
            imageUrl = pet.photo;
        } else if (type === 'chat') {
            // Untuk chat, anggap file URL disimpan langsung di pesan
            const chatFile = await ChatMessage.findById(id); // Model ChatMessage belum dibuat
            if (!chatFile || !chatFile.fileUrl) {
            return new Response(JSON.stringify({ error: 'Chat file not found.' }), { status: 404 });
            }
            imageUrl = chatFile.fileUrl;
        }
    
        return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
        } catch (error) {
        console.error('Error fetching image:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch image.' }), { status: 500 });
    }
}
