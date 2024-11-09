import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary dengan kredensial dari environment
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fungsi untuk mengupload file ke Cloudinary
export const uploadToCloudinary = async (file, type) => {
    const folder = {
        profile: 'profile_pictures',
        pet: 'pet_pictures',
        chat: 'chat_images',
    }[type];

    if (!folder) {
        throw new Error("Invalid upload type");
    }

    // Mengonversi file menjadi Buffer untuk upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Menggunakan Promise untuk menunggu hasil upload dan mengembalikan result secara langsung
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    reject(error); // Menangani error
                } else {
                    resolve(result); // Mengembalikan hasil yang berisi URL secure
                }
            }
        ).end(fileBuffer); // Memulai upload dengan fileBuffer
    });
};
