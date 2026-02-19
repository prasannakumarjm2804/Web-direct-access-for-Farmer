const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
    try {
        const { content, type, media, tags } = req.body;
        const post = new Post({
            author: req.user._id,
            content,
            type,
            media,
            tags
        });
        await post.save();
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const { type, tag, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (tag) filter.tags = tag;

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('author', 'name avatar role');

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const comment = new Comment({
            post: postId,
            author: req.user._id,
            content,
            isExpertComment: req.user.role === 'expert'
        });
        await comment.save();

        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
