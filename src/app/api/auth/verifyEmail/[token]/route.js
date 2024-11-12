import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/dbConfig';
import User from '@/models/userModel';
import crypto from 'crypto';

export async function GET(request, { params }) {
    try {
        await connectToDatabase();

        // Await the params to unwrap it
        const { token } = await params;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Token is invalid or has expired' },
                { status: 400 }
            );
        }

        // Update user
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();

        return NextResponse.json(
            { success: true, message: 'Email verified successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { success: false, message: 'Email verification failed' },
            { status: 500 }
        );
    }
}
