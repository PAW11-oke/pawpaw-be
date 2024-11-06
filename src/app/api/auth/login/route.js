import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/dbConfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';

export async function POST(request) {
    await connectToDatabase();

    try {
        const requestBody = await request.json();
        const { email, password } = requestBody;

        console.log('Received request body:', requestBody); // Debugging

        // Validasi jika email atau password kosong
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Cari user berdasarkan email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Bandingkan password dari request dengan hash password di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        // Buat token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        }, { status: 200 });

        // Set cookie dengan token
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60, // 1 jam
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Login failed', error: error.message }, { status: 500 });
    }
}
