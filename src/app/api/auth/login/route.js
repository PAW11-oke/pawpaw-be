import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/dbConfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';

export async function POST(request) {
    await connectToDatabase();
    const { email, password } = await request.json();

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Login failed' }, { status: 500 });
    }
}
