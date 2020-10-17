const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
  },
  publishYear: {
    type: Number,
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ['Want to read', 'Reading', 'Finished', 'Dropped'],
    default: 'Want to read',
  },
});

module.exports = mongoose.model('book', BookSchema);
