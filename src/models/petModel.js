import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    birthDate: {
        type: Date,
    },
    age: {
        type: Number,
    },
    petType: {
        type: String,
        required: true,
        enum: ['Anjing', 'Kucing', 'Kelinci', 'Hamster'],
    },
    breed: {
        type: String,
    }
});

export default mongoose.model('Pet', petSchema);