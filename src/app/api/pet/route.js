import { connectToDatabase } from '@/utils/dbConfig';
import { NextResponse } from 'next/server';
import Pet from '@/models/petModel';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner'); // Query parameter for owner ID
    const name = searchParams.get('name');  // Query parameter for pet name (optional)

    if (!owner) {
        return NextResponse.json(
            { success: false, error: 'Owner ID is required.' },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        let query = { owner }; // Base query: filter by owner
        if (name) {
            // Add name filter for partial match (case-insensitive)
            query.name = { $regex: name, $options: 'i' };
        }

        // Fetch pets based on the query, including owner information
        const pets = await Pet.find(query).populate('owner');

        return NextResponse.json(
            { success: true, data: pets },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching pets:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch pets.' },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await connectToDatabase();

    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required.' },
            { status: 400 }
        );
    }

    try {
        const pets = await Pet.find({ owner: userId });

        if (!pets || pets.length === 0) {
            return NextResponse.json(
                { error: 'No pets found for the given User ID.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ pets }, { status: 200 });
    } catch (error) {
        console.error('Error fetching pets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pets.' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    await connectToDatabase();

    const { owner, name, photo, birthDate, age, petType, breed } = await req.json();

    if (!owner || !name || !petType) {
        return NextResponse.json(
            { error: 'Owner, name, and pet type are required.' },
            { status: 400 }
        );
    }

    try {
        const newPet = await Pet.create({
            owner,
            name,
            photo,
            birthDate,
            age,
            petType,
            breed,
        });

        return NextResponse.json(
            { message: 'Pet created successfully.', pet: newPet },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating pet:', error);
        return NextResponse.json(
            { error: 'Failed to create pet.' },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    await connectToDatabase();

    const petId = req.nextUrl.searchParams.get('petId');
    const { name, photo, birthDate, age, petType, breed } = await req.json();

    if (!petId) {
        return NextResponse.json(
            { error: 'Pet ID is required.' },
            { status: 400 }
        );
    }

    try {
        const updatedPet = await Pet.findByIdAndUpdate(
            petId,
            {
                $set: {
                    name,
                    photo,
                    birthDate,
                    age,
                    petType,
                    breed,
                },
            },
            { new: true }
        );

        if (!updatedPet) {
            return NextResponse.json(
                { error: 'Pet not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Pet updated successfully.', pet: updatedPet },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating pet:', error);
        return NextResponse.json(
            { error: 'Failed to update pet.' },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    await connectToDatabase();

    const petId = req.nextUrl.searchParams.get('petId');
    const { name, photo, birthDate, age, petType, breed } = await req.json();

    if (!petId) {
        return NextResponse.json(
            { error: 'Pet ID is required.' },
            { status: 400 }
        );
    }

    try {
        const updatedPet = await Pet.findByIdAndUpdate(
            petId,
            {
                $set: {
                    name,
                    photo,
                    birthDate,
                    age,
                    petType,
                    breed,
                },
            },
            { new: true }
        );

        if (!updatedPet) {
            return NextResponse.json(
                { error: 'Pet not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Pet updated successfully.', pet: updatedPet },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating pet:', error);
        return NextResponse.json(
            { error: 'Failed to update pet.' },
            { status: 500 }
        );
    }
}
