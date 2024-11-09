import mongoose from 'mongoose';

const healthTrackingSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true,
    },
    medicalHistory: {
        type: String,
    },
    vaccines: [{
        vaccineName: String,
        dateGiven: Date,
    }],
    allergies: {
        type: String,
        default: '',
    },
});

export default mongoose.model('HealthTracking', healthTrackingSchema);
