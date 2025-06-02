const express = require('express');
const {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const { postValidation } = require('../validators/postValidator');
const validateRequest = require('../middleware/validateRequest');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Public: View all posts
router.get('/', getAllPosts);

// Private: View my own posts
router.get('/mine', requireAuth, getMyPosts);

// Private: Create a post
router.post('/', requireAuth, postValidation, validateRequest, createPost);

// Private: Update my own post only
router.put('/:id', requireAuth, postValidation, validateRequest, updatePost);

// Private: Delete my own post only
router.delete('/:id', requireAuth, deletePost);

module.exports = router;
