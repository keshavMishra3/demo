const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Get all posts
router.get('/', postController.getAllPosts);

// Get a post by ID
router.get('/:id', postController.getPostById);

router.get('/user/:userId', postController.getPostsByUserId);
// Create a new post
router.post('/', postController.createPost);

// Update a post by ID (full update)
router.put('/:id', postController.updatePost);

// Update post reactions (partial update)
router.patch('/:id', postController.updatePostReactions);
router.delete('/:id', postController.deletePost);

module.exports = router;

