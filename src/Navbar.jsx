// Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logoContainer">
        <img src="./src/assets/logo.png" alt="Logo" className="logo" />
        <span className="logoText">Forum Posting</span>
      </div>
      <div className="buttonContainer">
        <Link to="post/create" className="button">Create</Link>
        <Link to="/" className="button">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;
