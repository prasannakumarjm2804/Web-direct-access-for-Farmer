import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';
import axios from 'axios';
import './SmartAssistant.css';

const SmartAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Smart Farmer Assistant. Ask me anything about crop prices, weather, or farming tips.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Replace with your actual backend endpoint
            const response = await axios.post('/api/ai/ask-assistant', {
                query: input,
                language: 'en'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const botMessage = {
                text: response.data.data.answer || "I'm sorry, I couldn't process that.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="smart-assistant-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="chat-window"
                    >
                        <div className="chat-header">
                            <div className="flex items-center gap-2">
                                <FaRobot className="text-xl" />
                                <h3>Smart Assistant</h3>
                            </div>
                            <button onClick={toggleOpen} className="close-btn"><FaTimes /></button>
                        </div>

                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender}`}>
                                    <p>{msg.text}</p>
                                </div>
                            ))}
                            {loading && <div className="message bot typing">Thinking...</div>}
                        </div>

                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="Ask something..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="voice-btn"><FaMicrophone /></button>
                            <button onClick={handleSend} className="send-btn"><FaPaperPlane /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button onClick={toggleOpen} className="floating-fab">
                <FaRobot className="icon" />
            </button>
        </div>
    );
};

export default SmartAssistant;
