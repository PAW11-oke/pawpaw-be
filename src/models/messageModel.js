import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'love', 'haha', 'angry', 'sad'], required: true }, // Reaksi tambahan bisa ditambahkan sesuai kebutuhan
});

const messageSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat', required: true },  // Grup tempat pesan ini dikirim
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },  // Pesan teks
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date },  // Tanggal pesan diubah
    reactions: [reactionSchema],  // Array reaksi pada pesan
    files: [{ url: String, fileType: String }],  // File sharing, simpan URL dan tipe file (image, video, dokumen, dll)
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]  // Untuk pesan reply
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);