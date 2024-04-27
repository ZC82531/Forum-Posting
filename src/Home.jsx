import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './Home.css'; // Import CSS file for styling

const supabaseUrl = 'https://ckplyvdardrkczaslasz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrcGx5dmRhcmRya2N6YXNsYXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxNDc4MzQsImV4cCI6MjAyOTcyMzgzNH0.DV34OiSEbVmHBXRpaVJFASc53MYuQ_zsLfqAAojf8zE';

const supabase = createClient(supabaseUrl, supabaseKey);

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [sortByNewest, setSortByNewest] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('posts')
          .select('*');
  
        if (error) {
          console.error('Error fetching posts:', error.message);
        } else {
          setPosts(data);
        }
      };
      fetchData();
    }, []);

    useEffect(() => {
      // Filter and sort posts based on upvote count or timestamp
      const sortedPosts = posts.slice().sort((a, b) => {
        if (sortByNewest) {
          return new Date(b.order_utf8) - new Date(a.order_utf8); // Sort by timestamp for newest on top
        } else {
          return b.upvotes_count - a.upvotes_count; // Sort by upvotes
        }
      });
      setFilteredPosts(sortedPosts);
    }, [posts, sortByNewest]);

    const handleSortToggle = () => {
      setSortByNewest(!sortByNewest);
    };

    return (
      <div className="home-container">
        <h1>Home</h1>
        <div className="filter-container">
          <button onClick={handleSortToggle} className="filter-button">
            {sortByNewest ? "Sort by Upvotes" : "Sort by Newest"}
          </button>
        </div>
        <div className="posts-container">
          {filteredPosts.map(post => (
            <div key={post.id} className="post">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>Upvotes: {post.upvotes_count}</p>
              <p>First Created: {new Date(post.order_utf8).toLocaleString()}</p>
              <Link to={`/post/${post.id}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
};

export default Home;
