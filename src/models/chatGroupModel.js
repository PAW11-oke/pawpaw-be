import mongoose from 'mongoose';

const groupChatSchema = new mongoose.Schema({
    groupName: { type: String, required: true },  // Nama grup, seperti 'Kucing', 'Anjing', dll.
    petType: { type: String, required: true },  // Tipe hewan peliharaan
});

export default mongoose.models.GroupChat || mongoose.model('GroupChat', groupChatSchema);