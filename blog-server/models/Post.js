const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      author: {
        type: String,
        required: [true, 'Author name is required!'],
        trim: true,
      },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Post', postSchema);
