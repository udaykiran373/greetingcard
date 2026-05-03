const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Birthday', 'Anniversary', 'Festival', 'Love', 'Shayari', 'Motivational', 'Friendship', 'Good Morning', 'Good Night', 'New Year', 'Exam', 'Wedding', 'Appreciation', 'Care', 'Family', 'Work'],
    index: true
  },
  isPremium: {
    type: Boolean,
    default: false,
    index: true
  },
  // Where to position profile picture overlay (percentage of card)
  profileOverlay: {
    x: { type: Number, default: 5 },   // % from left
    y: { type: Number, default: 5 },   // % from top
    size: { type: Number, default: 20 } // % of card width
  },
  // Where to position name text overlay
  nameOverlay: {
    x: { type: Number, default: 50 },  // % from left (center)
    y: { type: Number, default: 8 },   // % from top
    fontSize: { type: Number, default: 24 },
    color: { type: String, default: '#FFFFFF' },
    fontWeight: { type: String, default: 'bold' }
  },
  tags: [{ type: String, trim: true }],
  emoji: { type: String, default: '' },
  gradient: { type: String, default: '' },
  wish: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  downloadCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);
