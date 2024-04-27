import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './CreatePost.css'; // Import the CSS file for styling

const supabaseUrl = 'https://ckplyvdardrkczaslasz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrcGx5dmRhcmRya2N6YXNsYXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxNDc4MzQsImV4cCI6MjAyOTcyMzgzNH0.DV34OiSEbVmHBXRpaVJFASc53MYuQ_zsLfqAAojf8zE';

const supabase = createClient(supabaseUrl, supabaseKey);


const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Get current timestamp and convert it to ISO string format
            const currentTimestamp = new Date().toISOString();
            
            // Add post to the database
            const { data, error } = await supabase.from('posts').insert([
                {
                    title: title,
                    content: content,
                    order_utf8: currentTimestamp,
                    // Add other fields as needed
                }
            ]);
            if (error) {
                throw error;
            }
            // Redirect to the home page
            window.location.href = '/'; // Replace '/' with the desired URL
        } catch (error) {
            console.error('Error adding post:', error.message);
        }
    };
    

    return (
        <div className="create-post">
            <h1>Create New Post</h1>
            <form onSubmit={handleSubmit} className="post-form">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;