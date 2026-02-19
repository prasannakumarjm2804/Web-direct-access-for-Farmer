const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const communityController = require('../controllers/community.controller');

router.post('/posts', authenticate, communityController.createPost);
router.get('/posts', communityController.getPosts); // Public or authenticated? Let's make it public for read
router.post('/comments', authenticate, communityController.addComment);

module.exports = router;
