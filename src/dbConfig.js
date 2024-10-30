import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) {
        console.log('=> Using existing database connection');
        return;
    }

    try {
        const { connection } = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'pawpaw', 
        });

        isConnected = connection.readyState === 1;
        console.log('=> MongoDB connected successfully');
    } catch (error) {
        console.error('=> MongoDB connection failed:', error);
        throw new Error('MongoDB connection failed');
    }
}