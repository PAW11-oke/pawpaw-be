export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
    });

    console.log()

    if (!res.ok) {
        console.log("error: ", error);
    }

    const data = await res.json();
    return data.secure_url; 
};
