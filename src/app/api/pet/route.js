import { connectToDatabase } from '@/utils/dbConfig';
import { NextResponse } from 'next/server';
import Pet from '@/models/petModel';
import { authMiddleware } from '@/utils/authMiddleware';
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary';

export async function GET(req) {
    try {
        // Auth check
        const authResult = await authMiddleware(req);
        if (!authResult || authResult.status === 401) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDatabase();

        // Get pets owned by the authenticated user
        const pets = await Pet.find({ owner: req.userId });

        return new Response(
            JSON.stringify({
                success: true,
                data: pets
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching pets:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch pets.' }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        // Auth check
        const authResult = await authMiddleware(req);
        if (!authResult || authResult.status === 401) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDatabase();

        const formData = await req.formData();
        const name = formData.get('name');
        const petType = formData.get('petType');
        const breed = formData.get('breed');
        const birthDate = formData.get('birthDate');
        const age = formData.get('age');
        const photo = formData.get('photo');

        if (!name || !petType) {
            return new Response(
                JSON.stringify({ error: 'Name and pet type are required.' }),
                { status: 400 }
            );
        }

        // Handle photo upload if provided
        let photoUrl = null;
        if (photo && photo.size > 0) {
            const uploadResult = await uploadToCloudinary(photo, 'pet');
            if (uploadResult.error) {
                return new Response(
                    JSON.stringify({ error: 'Failed to upload photo.' }),
                    { status: 400 }
                );
            }
            photoUrl = uploadResult.secure_url;
        }

        // Create new pet
        const newPet = await Pet.create({
            owner: req.userId,
            name,
            petType,
            breed,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            age: parseInt(age) || undefined,
            photo: photoUrl
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: newPet
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating pet:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create pet.' }),
            { status: 500 }
        );
    }
}

// app/api/pets/[id]/route.js
export async function PUT(req, { params }) {
    try {
        // Auth check
        const authResult = await authMiddleware(req);
        if (!authResult || authResult.status === 401) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDatabase();

        const formData = await req.formData();
        const name = formData.get('name');
        const petType = formData.get('petType');
        const breed = formData.get('breed');
        const birthDate = formData.get('birthDate');
        const age = formData.get('age');
        const photo = formData.get('photo');

        // Get existing pet and verify ownership
        const existingPet = await Pet.findOne({ 
            _id: params.id,
            owner: req.userId 
        });

        if (!existingPet) {
            return new Response(
                JSON.stringify({ error: 'Pet not found or unauthorized.' }),
                { status: 404 }
            );
        }

        // Handle photo update if provided
        let photoUrl = existingPet.photo;
        if (photo && photo.size > 0) {
            // Delete old photo if exists
            if (existingPet.photo) {
                await deleteFromCloudinary(existingPet.photo);
            }

            // Upload new photo
            const uploadResult = await uploadToCloudinary(photo, 'pet');
            if (uploadResult.error) {
                return new Response(
                    JSON.stringify({ error: 'Failed to upload photo.' }),
                    { status: 400 }
                );
            }
            photoUrl = uploadResult.secure_url;
        }

        // Update pet
        const updatedPet = await Pet.findByIdAndUpdate(
            params.id,
            {
                name: name || existingPet.name,
                petType: petType || existingPet.petType,
                breed: breed || existingPet.breed,
                birthDate: birthDate ? new Date(birthDate) : existingPet.birthDate,
                age: age ? parseInt(age) : existingPet.age,
                photo: photoUrl
            },
            { new: true }
        );

        return new Response(
            JSON.stringify({
                success: true,
                data: updatedPet
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating pet:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update pet.' }),
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        // Auth check
        const authResult = await authMiddleware(req);
        if (!authResult || authResult.status === 401) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDatabase();

        // Get pet and verify ownership
        const pet = await Pet.findOne({ 
            _id: params.id,
            owner: req.userId 
        });

        if (!pet) {
            return new Response(
                JSON.stringify({ error: 'Pet not found or unauthorized.' }),
                { status: 404 }
            );
        }

        // Delete photo from Cloudinary if exists
        if (pet.photo) {
            await deleteFromCloudinary(pet.photo);
        }

        // Delete pet from database
        await Pet.findByIdAndDelete(params.id);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Pet deleted successfully.'
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting pet:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete pet.' }),
            { status: 500 }
        );
    }
}