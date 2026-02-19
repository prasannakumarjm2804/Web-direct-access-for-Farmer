import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
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
            // Mock data if backend not ready or empty
            const res = await axios.get('/api/community/posts');
            setPosts(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/community/posts', {
                content: newPostContent,
                type: 'discussion' // Default type
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts([res.data.data, ...posts]);
            setNewPostContent('');
        } catch (error) {
            console.error('Failed to create post', error);
        }
    };

    return (
        <div className="community-page-container">
            <header className="community-header">
                <h1>Farmer Community Hub 🌾</h1>
                <p>Share knowledge, ask experts, and connect with fellow farmers.</p>
            </header>

            <div className="community-content">
                {/* Create Post Section */}
                <div className="create-post-card">
                    <textarea
                        placeholder="What's on your mind? Ask a question or share a tip..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                    ></textarea>
                    <div className="create-post-actions">
                        <button className="post-btn" onClick={handleCreatePost}>
                            <FaPlus /> Post Update
                        </button>
                    </div>
                </div>

                {/* Feed Section */}
                <div className="posts-feed">
                    {loading ? (
                        <p>Loading community posts...</p>
                    ) : posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className="post-card">
                                <div className="post-header">
                                    <div className="avatar-placeholder">{post.author?.name?.[0] || 'U'}</div>
                                    <div>
                                        <h4>{post.author?.name || 'Unknown Farmer'}</h4>
                                        <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`post-tag ${post.type}`}>{post.type}</span>
                                </div>
                                <div className="post-body">
                                    <p>{post.content}</p>
                                </div>
                                <div className="post-footer">
                                    <button className="action-btn"><FaThumbsUp /> Like ({post.likesCount})</button>
                                    <button className="action-btn"><FaComment /> Comment ({post.commentsCount})</button>
                                    <button className="action-btn"><FaShare /> Share</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No discussions yet. Be the first to start one!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
