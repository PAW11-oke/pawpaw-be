import mongoose from 'mongoose';

const petCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Anjing', 'Kucing', 'Kelinci', 'Hamster'],
  },
});

export default mongoose.models.PetCategory || mongoose.model('PetCategory', petCategorySchema);