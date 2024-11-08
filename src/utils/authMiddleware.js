import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function authMiddleware(request) {
    // Retrieve token from cookies and get the token value
    const token = request.cookies.get('token')?.value;
    console.log('Token received:', token); // Debugging: to confirm token is in the correct format

    // Ensure the token is a string before processing
    if (!token || typeof token !== 'string') {
        console.error('Token is not a string or is missing');
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.userId = decoded.userId;  // Attach userId to request for further use
        console.log('JWT verified successfully:', decoded);
    } catch (error) {
        console.error('JWT verification error:', error);
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.next();
}
