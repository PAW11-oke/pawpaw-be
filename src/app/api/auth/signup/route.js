import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import { connectToDatabase } from '@/utils/dbConfig';
import { emailVerify } from '@/utils/emailVerify';

export async function POST(request) {
    try {
        await connectToDatabase();
        
        // Parse request body
        const { name, email, password } = await request.json();

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already in use' },
                { status: 400 }
            );
        }

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        try {
            // Send verification email
            await emailVerify(newUser, request, 'signup');

            return NextResponse.json(
                {
                    message: 'Account created! Please check your email to verify your account.',
                    success: true
                },
                { status: 201 }
            );
        } catch (emailError) {
            // If email verification fails, we should still return success but with a warning
            return NextResponse.json(
                {
                    message: 'Account created, but failed to send verification email. Please contact support.',
                    success: true
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Failed to create account' },
            { status: 500 }
        );
    }
}