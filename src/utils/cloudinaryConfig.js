import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer) => {
    try {
        const uploadResult = await cloudinary.uploader.upload_stream(
            { folder: 'chat_files', resource_type: 'auto' },
            (error, result) => {
                if (error) throw error;
                return result.secure_url;
            }
        );

        // Menggunakan stream untuk upload file buffer
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);
        bufferStream.pipe(uploadResult);
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload file to Cloudinary');
    }
};
