import connectToDatabase from '@/utils/database';
import Grooming from '@/models/Grooming';
import Pet from '@/models/Pet';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner'); // Query parameter for user ID (owner)

    if (!owner) {
        return NextResponse.json(
            { success: false, error: 'Owner ID is required.' },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        // Find all pets owned by the user
        const pets = await Pet.find({ owner }).select('_id');
        const petIds = pets.map(pet => pet._id);

        // Find all grooming sessions related to the user's pets
        const groomingSessions = await Grooming.find({ pet: { $in: petIds } })
            .populate('pet', 'name') // Populate pet name for better readability
            .sort({ schedule: 1 }); // Sort by schedule date (ascending)

        // Format the response to include both date and time split
        const formattedData = groomingSessions.map(session => {
            const date = session.schedule.toISOString().split('T')[0]; // Extract date part
            const time = session.schedule.toISOString().split('T')[1].slice(0, 5); // Extract time part
            return {
                _id: session._id,
                petName: session.pet.name,
                scheduleDate: date,
                scheduleTime: time,
                location: session.location,
                note: session.note,
            };
        });

        return NextResponse.json(
            { success: true, data: formattedData },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching grooming sessions:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch grooming sessions.' },
            { status: 500 }
        );
    }
}
export async function POST(request) {
    try {
        const body = await request.json();

        const { pet, scheduleDate, scheduleTime, location, note } = body;

        // Validasi input
        if (!pet || !scheduleDate || !scheduleTime) {
            return NextResponse.json(
                { success: false, error: 'Pet ID, schedule date, and schedule time are required.' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const grooming = new Grooming({
            pet,
            scheduleDate: new Date(scheduleDate), // Format tanggal
            scheduleTime, // Format waktu sebagai string
            location,
            note,
        });

        await grooming.save();

        return NextResponse.json(
            { success: true, data: grooming },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating grooming session:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create grooming session.' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id'); // Grooming session ID

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Grooming ID is required.' },
                { status: 400 }
            );
        }

        const body = await request.json();

        const { pet, scheduleDate, scheduleTime, location, note } = body;

        await connectToDatabase();

        const updatedGrooming = await Grooming.findByIdAndUpdate(
            id,
            {
                ...(pet && { pet }),
                ...(scheduleDate && { scheduleDate: new Date(scheduleDate) }),
                ...(scheduleTime && { scheduleTime }),
                ...(location && { location }),
                ...(note && { note }),
            },
            { new: true, runValidators: true }
        );

        if (!updatedGrooming) {
            return NextResponse.json(
                { success: false, error: 'Grooming session not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedGrooming },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating grooming session:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update grooming session.' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id'); // Grooming session ID

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Grooming ID is required.' },
                { status: 400 }
            );
        }

        const body = await request.json();

        const { pet, scheduleDate, scheduleTime, location, note } = body;

        await connectToDatabase();

        const updatedGrooming = await Grooming.findByIdAndUpdate(
            id,
            {
                ...(pet && { pet }),
                ...(scheduleDate && { scheduleDate: new Date(scheduleDate) }),
                ...(scheduleTime && { scheduleTime }),
                ...(location && { location }),
                ...(note && { note }),
            },
            { new: true, runValidators: true }
        );

        if (!updatedGrooming) {
            return NextResponse.json(
                { success: false, error: 'Grooming session not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedGrooming },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating grooming session:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update grooming session.' },
            { status: 500 }
        );
    }
}
