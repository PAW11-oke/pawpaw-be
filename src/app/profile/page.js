"use client";

import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadType, setUploadType] = useState("profile");
    const [statusMessage, setStatusMessage] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);

    // Fetch profile picture on component mount
    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const res = await fetch('/api/upload');
                const data = await res.json();

                if (res.ok) {
                    setProfilePicture(data.profilePicture); // Set profile picture URL from Cloudinary
                } else {
                    console.error('Error fetching profile picture:', data.error);
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        fetchProfilePicture();
    }, []);

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    // Handle file upload to Cloudinary
    const handleUpload = async () => {
        const fileInput = document.getElementById('imageInput');
        if (!fileInput.files.length) return; // Ensure a file is selected

        setIsUploading(true);
        setStatusMessage(""); // Reset status message

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('type', uploadType); // Pass the upload type to API

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setUploadedImageUrl(data.url); // Cloudinary URL of uploaded image
                setProfilePicture(data.url); // Update profile picture with new uploaded image
                setSelectedImage(null); // Clear selected image preview
                fileInput.value = ""; // Clear file input
                setStatusMessage("Image uploaded successfully!"); // Success message
            } else {
                console.error('Upload failed:', data.error);
                setStatusMessage("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setStatusMessage("Error uploading image");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Profile</h1>

            {/* Profile Picture from Cloudinary */}
            {profilePicture && (
                <div className="mb-4">
                    <p className="text-gray-700 mb-2">Current Profile Picture:</p>
                    <img src={profilePicture} alt="Profile" className="w-full h-auto rounded-lg shadow-md" />
                </div>
            )}

            <h2 className="text-lg font-semibold mb-4">Upload New Profile Picture</h2>

            {/* Image Preview */}
            {selectedImage && (
                <div className="mb-4">
                    <p className="text-gray-700 mb-2">Selected Image:</p>
                    <img src={selectedImage} alt="Selected" className="w-full h-auto rounded-lg shadow-md" />
                </div>
            )}

            {/* File Input */}
            <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
            />

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!selectedImage || isUploading}
                className={`w-full py-2 px-4 font-semibold rounded-lg ${isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>

            {/* Status Message */}
            {statusMessage && (
                <p className="mt-4 text-center text-green-600">{statusMessage}</p>
            )}

            {/* Uploaded Image Display */}
            {uploadedImageUrl && (
                <div className="mt-6">
                    <p className="text-gray-700 mb-2">Uploaded Image:</p>
                    <img src={uploadedImageUrl} alt="Uploaded" className="w-full h-auto rounded-lg shadow-md" />
                </div>
            )}
        </div>
    );
}
