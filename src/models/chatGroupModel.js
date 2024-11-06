import mongoose from 'mongoose';

const groupChatSchema = new mongoose.Schema({
    groupName: { type: String, required: true },  // Nama grup, seperti 'Kucing', 'Anjing', dll.
    petType: { type: String, required: true },  // Tipe hewan peliharaan
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Daftar anggota grup
    isGlobal: { type: Boolean, default: false },  // Menandai apakah ini adalah grup global atau tidak
});

export default mongoose.models.GroupChat || mongoose.model('GroupChat', groupChatSchema);