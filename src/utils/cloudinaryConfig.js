import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (filePath) => {
    return cloudinary.uploader.upload(filePath, {
        folder: 'chat_files',
        resource_type: 'auto', // Support all types of files
    });
};
