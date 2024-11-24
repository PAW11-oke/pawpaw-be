// utils/uploadHandler.js
import { uploadToCloudinary } from '@/utils/cloudinaryConfig';
import User from '@/models/userModel';
import Pet from '@/models/petModel';
import ChatMessage from '@/models/messageModel';

/**
 * Generic file upload handler that can be used across different routes
 * @param {File} file - File object to upload
 * @param {string} type - Type of upload ('profile', 'pet', 'chat')
 * @param {string} id - ID of the associated record
 * @param {string} userId - User ID from authentication (optional, required for profile updates)
 * @returns {Promise<{url: string, error: string|null}>}
 */

export async function handleFileUpload(file, type, id, userId = null) {
    try {
        // Validate inputs
        if (!file || !type) {
        throw new Error('File and type are required.');
        }

        if (['pet', 'chat'].includes(type) && !id) {
        throw new Error('ID is required for pet and chat uploads.');
        }

        if (type === 'profile' && !userId) {
        throw new Error('User ID is required for profile uploads.');
        }

        // Upload file to Cloudinary
        const uploadResult = await uploadToCloudinary(file, type);
        if (!uploadResult || !uploadResult.secure_url) {
        throw new Error('Failed to upload file to Cloudinary.');
        }

        // Update database based on type
        let result;
        switch (type) {
        case 'profile':
            result = await User.findByIdAndUpdate(
            userId,
            { profilePicture: uploadResult.secure_url },
            { new: true }
            );
            if (!result) throw new Error('User not found.');
            break;

        case 'pet':
            result = await Pet.findByIdAndUpdate(
            id,
            { photo: uploadResult.secure_url },
            { new: true }
            );
            if (!result) throw new Error('Pet not found.');
            break;

        case 'chat':
            result = await ChatMessage.findByIdAndUpdate(
            id,
            { fileUrl: uploadResult.secure_url },
            { new: true }
            );
            if (!result) throw new Error('Chat not found.');
            break;

        default:
            throw new Error('Invalid upload type.');
        }

        return {
        url: uploadResult.secure_url,
        error: null
        };

    } catch (error) {
        console.error('Upload handler error:', error);
        return {
        url: null,
        error: error.message || 'Failed to process upload.'
        };
    }
    }

    /**
     * Retrieve file URL based on type and ID
     * @param {string} type - Type of file ('profile', 'pet', 'chat')
     * @param {string} id - ID of the associated record
     * @returns {Promise<{url: string|null, error: string|null}>}
     */
    export async function getFileUrl(type, id) {
    try {
        if (!type || !id) {
        throw new Error('Type and ID are required.');
        }

        let result;
        switch (type) {
        case 'profile':
            result = await User.findById(id);
            if (!result || !result.profilePicture) {
            throw new Error('Profile picture not found.');
            }
            return { url: result.profilePicture, error: null };

        case 'pet':
            result = await Pet.findById(id);
            if (!result || !result.photo) {
            throw new Error('Pet photo not found.');
            }
            return { url: result.photo, error: null };

        case 'chat':
            result = await ChatMessage.findById(id);
            if (!result || !result.fileUrl) {
            throw new Error('Chat file not found.');
            }
            return { url: result.fileUrl, error: null };

        default:
            throw new Error('Invalid file type.');
        }
    } catch (error) {
        console.error('Get file URL error:', error);
        return {
        url: null,
        error: error.message || 'Failed to retrieve file URL.'
        };
    }
}

export async function deleteFromCloudinary(url) {
    try {
        // Extract public_id from URL
        const publicId = url.split('/').slice(-2).join('/').split('.')[0];
        
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
}