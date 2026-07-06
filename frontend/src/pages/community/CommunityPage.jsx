import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiPlus, FiThumbsUp, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import './CommunityPage.css';

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/api/community/posts');
            setPosts(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/community/posts', {
                content: newPostContent,
                type: 'discussion',
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts([res.data.data, ...posts]);
            setNewPostContent('');
        } catch (error) {
            console.error('Failed to create post', error);
        }
    };

    return (
        <div className="community-page page-wrapper">
            <div className="container">
                <PageHeader
                    variant="soft"
                    badge="Community"
                    title="Farmer Community Hub"
                    subtitle="Share knowledge, ask experts, and connect with fellow farmers across India."
                    icon="🌾"
                />

                <div className="community-content">
                    <div className="create-post-card card">
                        <textarea
                            className="form-textarea"
                            placeholder="What's on your mind? Ask a question or share a farming tip..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        <div className="create-post-actions">
                            <button className="btn btn-primary" onClick={handleCreatePost}>
                                <FiPlus /> Post Update
                            </button>
                        </div>
                    </div>

                    <div className="posts-feed">
                        {loading ? (
                            <SkeletonLoader type="list" count={4} />
                        ) : posts.length > 0 ? (
                            posts.map((post, i) => (
                                <motion.div
                                    key={post._id}
                                    className="post-card card"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className="post-header">
                                        <div className="avatar-placeholder">
                                            {post.author?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4>{post.author?.name || 'Unknown Farmer'}</h4>
                                            <span className="post-time">
                                                {new Date(post.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <span className={`post-tag badge badge-tag ${post.type}`}>{post.type}</span>
                                    </div>
                                    <div className="post-body">
                                        <p>{post.content}</p>
                                    </div>
                                    <div className="post-footer">
                                        <button className="post-action-btn" type="button">
                                            <FiThumbsUp /> Like ({post.likesCount || 0})
                                        </button>
                                        <button className="post-action-btn" type="button">
                                            <FiMessageSquare /> Comment ({post.commentsCount || 0})
                                        </button>
                                        <button className="post-action-btn" type="button">
                                            <FiShare2 /> Share
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">💬</div>
                                <h3>No discussions yet</h3>
                                <p>Be the first to start a conversation with the community!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
