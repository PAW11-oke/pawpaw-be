import jwt from 'jsonwebtoken';

export function verifyToken(request) {
    const token = request.cookies.get('token')?.value || null;

    if (!token) {
        throw new Error("Token not found");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        return decoded;
    } catch (error) {
        console.error("JWT verification error:", error);
        throw error; // or return an appropriate response
    }
}
