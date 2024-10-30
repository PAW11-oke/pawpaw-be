import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/dbConfig';
import User from '@/models/userModel';

export async function POST(request) {
    await connectToDatabase();
    try {
        const { name, email, password } = await request.json();

        console.log('Received Data:', { name, email, password }); 

        const newUser = new User({ name, email, password });
        await newUser.save();

        return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
    } catch (error) {
        console.error('Error:', error); // Logging error detail
        return NextResponse.json(
            { message: 'Failed to create user', error: error.message },
            { status: 500 }
        );
    }
}