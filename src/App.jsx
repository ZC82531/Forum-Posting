// App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import PostDetails from './PostDetails';
import CreatePost from './CreatePost';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="post/create" element={<CreatePost />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
