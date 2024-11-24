// app/api/grooming/route.js
import { connectToDatabase } from '@/utils/dbConfig';
import { authMiddleware } from '@/utils/authMiddleware';
import Grooming from '@/models/groomingModel';
import Pet from '@/models/petModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // Auth check
        const authResult = await authMiddleware(req);
        if (!authResult || authResult.status === 401) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDatabase();

        // Find all pets owned by the authenticated user
        const pets = await Pet.find({ owner: req.userId }).select('_id');
        const petIds = pets.map(pet => pet._id);

        // Find all grooming sessions related to the user's pets
        const groomingSessions = await Grooming.find({ pet: { $in: petIds } })
            .populate('pet', 'name photo') // Include pet photo
            .sort({ schedule: -1 }); // Sort by schedule date (newest first)

        // Format the response
        const formattedData = groomingSessions.map(session => ({
            _id: session._id,
            pet: {
                _id: session.pet._id,
                name: session.pet.name,
                photo: session.pet.photo || '/DefaultProfilePicture.png'
            },
            scheduleDate: session.scheduleDate.toISOString().split('T')[0],
            scheduleTime: session.scheduleTime,
            location: session.location,
            note: session.note,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt
        }));

        return new Response(
            JSON.stringify({
                success: true,
                data: formattedData
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching grooming sessions:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'Failed to fetch grooming sessions.' 
            }),
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

        const { pet: petId, scheduleDate, scheduleTime, location, note } = await req.json();

        // Validasi input
        if (!petId || !scheduleDate || !scheduleTime) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Pet ID, schedule date, and schedule time are required.' 
                }),
                { status: 400 }
            );
        }

        // Verify pet ownership
        const pet = await Pet.findOne({ 
            _id: petId,
            owner: req.userId 
        });

        if (!pet) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Pet not found or unauthorized.' 
                }),
                { status: 404 }
            );
        }

        // Create grooming session
        const grooming = new Grooming({
            pet: petId,
            scheduleDate: new Date(scheduleDate),
            scheduleTime,
            location,
            note
        });

        await grooming.save();

        // Populate pet details in response
        const populatedGrooming = await Grooming.findById(grooming._id)
            .populate('pet', 'name photo');

        const formattedResponse = {
            _id: populatedGrooming._id,
            pet: {
                _id: populatedGrooming.pet._id,
                name: populatedGrooming.pet.name,
                photo: populatedGrooming.pet.photo || '/DefaultProfilePicture.png'
            },
            scheduleDate: populatedGrooming.scheduleDate.toISOString().split('T')[0],
            scheduleTime: populatedGrooming.scheduleTime,
            location: populatedGrooming.location,
            note: populatedGrooming.note,
            createdAt: populatedGrooming.createdAt,
            updatedAt: populatedGrooming.updatedAt
        };

        return new Response(
            JSON.stringify({
                success: true,
                data: formattedResponse
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating grooming session:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'Failed to create grooming session.' 
            }),
            { status: 500 }
        );
    }
}

// app/api/grooming/[id]/route.js
export async function PUT(req, { params }) {
    try {
        // Auth check
        const authResult = await authMiddleware(req);
        if (!authResult || authResult.status === 401) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDatabase();

        const { pet: petId, scheduleDate, scheduleTime, location, note } = await req.json();

        // If petId is provided, verify ownership
        if (petId) {
            const pet = await Pet.findOne({ 
                _id: petId,
                owner: req.userId 
            });

            if (!pet) {
                return new Response(
                    JSON.stringify({ 
                        success: false, 
                        error: 'Pet not found or unauthorized.' 
                    }),
                    { status: 404 }
                );
            }
        }

        // Verify grooming session ownership through pet
        const existingGrooming = await Grooming.findById(params.id)
            .populate('pet', 'owner');

        if (!existingGrooming || existingGrooming.pet.owner.toString() !== req.userId) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Grooming session not found or unauthorized.' 
                }),
                { status: 404 }
            );
        }

        // Update grooming session
        const updatedGrooming = await Grooming.findByIdAndUpdate(
            params.id,
            {
                ...(petId && { pet: petId }),
                ...(scheduleDate && { scheduleDate: new Date(scheduleDate) }),
                ...(scheduleTime && { scheduleTime }),
                ...(location !== undefined && { location }),
                ...(note !== undefined && { note })
            },
            { new: true, runValidators: true }
        ).populate('pet', 'name photo');

        const formattedResponse = {
            _id: updatedGrooming._id,
            pet: {
                _id: updatedGrooming.pet._id,
                name: updatedGrooming.pet.name,
                photo: updatedGrooming.pet.photo || '/DefaultProfilePicture.png'
            },
            scheduleDate: updatedGrooming.scheduleDate.toISOString().split('T')[0],
            scheduleTime: updatedGrooming.scheduleTime,
            location: updatedGrooming.location,
            note: updatedGrooming.note,
            createdAt: updatedGrooming.createdAt,
            updatedAt: updatedGrooming.updatedAt
        };

        return new Response(
            JSON.stringify({
                success: true,
                data: formattedResponse
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating grooming session:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'Failed to update grooming session.' 
            }),
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

        // Verify grooming session ownership through pet
        const existingGrooming = await Grooming.findById(params.id)
            .populate('pet', 'owner');

        if (!existingGrooming || existingGrooming.pet.owner.toString() !== req.userId) {
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Grooming session not found or unauthorized.' 
                }),
                { status: 404 }
            );
        }

        await Grooming.findByIdAndDelete(params.id);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Grooming session deleted successfully.'
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting grooming session:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'Failed to delete grooming session.' 
            }),
            { status: 500 }
        );
    }
}