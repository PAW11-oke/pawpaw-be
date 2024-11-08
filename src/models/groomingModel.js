import mongoose from 'mongoose';

const groomingSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true,
    },
    schedule: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
    },
    note: {
        type: String,
    },
});

export default mongoose.model('Grooming', groomingSchema);
