import mongoose from "mongoose";

const dailyActivitySchema = new mongoose.Schema({
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    photo: {
      type: String,
    },
    caption: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export default mongoose.model('DailyActivity', dailyActivitySchema);
  