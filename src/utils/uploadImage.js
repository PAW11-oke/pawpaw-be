export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Dapatkan dari Cloudinary

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Failed to upload file');
    }

    const data = await res.json();
    return {
        url: data.secure_url,
        fileType: file.type.split('/')[0], // Untuk mendapatkan tipe file (image, video, dll.)
    };
};
