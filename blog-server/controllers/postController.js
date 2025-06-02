const Post = require('../models/Post');

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const userId = req.user.id;

    const post = await Post.create({
      title,
      content,
      author, 
      userId,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all posts (public)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'username');
    res.status(200).json(posts);
  } catch (err) {
    console.error('Get all posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get only the logged-in user's posts
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error('Get my posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.author = req.body.author || post.author;

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
