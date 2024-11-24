// app/api/pets/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/dbConfig';
import { authMiddleware } from '@/utils/authMiddleware';
import Pet from '@/models/petModel';
import DailyActivity from '@/models/dailyActivityModel';

export async function GET(req) {
    try {
        // Auth check
        const authResult = await authMiddleware(req);
        if (!authResult || authResult.status === 401) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');

        // Base query dengan owner dari auth
        let query = { owner: req.userId };

        // Tambahkan filter nama jika ada
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        // Fetch pets
        const pets = await Pet.find(query).lean();

        // Fetch activities untuk semua pets
        const petsWithActivities = await Promise.all(
            pets.map(async (pet) => {
                const activities = await DailyActivity.find({ pet: pet._id })
                    .select('photo caption createdAt')
                    .sort({ createdAt: -1 })
                    .lean();

                return {
                    _id: pet._id,
                    name: pet.name,
                    petType: pet.petType,
                    birthDate: pet.birthDate,
                    age: pet.age,
                    breed: pet.breed,
                    photo: pet.photo || '/DefaultProfilePicture.png',
                    activities: activities.map(activity => ({
                        _id: activity._id,
                        photo: activity.photo || '/DefaultProfilePicture.png',
                        caption: activity.caption,
                        date: activity.createdAt
                    }))
                };
            })
        );

        if (!petsWithActivities || petsWithActivities.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'No pets found.',
                    data: []
                }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: petsWithActivities
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching pets:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'Failed to fetch pets.' 
            }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    await connectToDatabase();

    // Autentikasi
    const authResult = await authMiddleware(req);
    if (authResult && authResult.status === 401) {
        return authResult;
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const petId = formData.get('pet');
        const caption = formData.get('caption');

        // Validasi input
        if (!file || !petId) {
            return NextResponse.json(
                { success: false, error: 'File and Pet ID are required.' },
                { status: 400 }
            );
        }

        // Handle file upload dengan detail tambahan
        const uploadResult = await handleFileUpload(
            file,
            'pet',
            {
                petId,
                caption
            },
            req.userId
        );

        if (uploadResult.error) {
            return NextResponse.json(
                { success: false, error: uploadResult.error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: uploadResult.data
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating daily activity:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create daily activity.' },
            { status: 500 }
        );
    }
}