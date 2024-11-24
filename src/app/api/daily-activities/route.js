import connectToDatabase from '@/utils/database';
import DailyActivity from '@/models/DailyActivity';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId'); // User ID
        const petId = searchParams.get('petId');   // Pet ID

        if (!userId || !petId) {
            return NextResponse.json(
                { success: false, error: 'User ID and Pet ID are required.' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Fetch daily activities for the given user and pet
        const activities = await DailyActivity.find({ pet: petId })
            .populate('pet', 'name owner') // Populate pet details
            .exec();

        return NextResponse.json(
            { success: true, data: activities },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching daily activities:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch daily activities.' },
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

    const formData = await req.formData();
    const file = formData.get('file');
    const petId = formData.get('pet'); // ID pet yang terkait
    const caption = formData.get('caption');

    // Validasi input
    if (!file || !petId) {
        return new Response(
            JSON.stringify({ error: 'File and Pet ID are required.' }),
            { status: 400 }
        );
    }

    try {
        // Upload ke Cloudinary
        const uploadResult = await uploadToCloudinary(file, 'daily_activities');

        // Simpan ke database
        const dailyActivity = new DailyActivity({
            pet: petId,
            photo: uploadResult.secure_url,
            caption: caption || '', // Default kosong jika caption tidak diisi
        });

        await dailyActivity.save();

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    _id: dailyActivity._id,
                    pet: dailyActivity.pet,
                    photo: dailyActivity.photo,
                    caption: dailyActivity.caption,
                    createdAt: dailyActivity.createdAt,
                },
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating daily activity:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create daily activity.' }),
            { status: 500 }
        );
    }
}