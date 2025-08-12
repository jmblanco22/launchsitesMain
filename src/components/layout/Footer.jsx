import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-socials">
        
      </div>
      <p>&copy; {new Date().getFullYear()} Launchsites. All rights reserved. Your mission, our code.</p>
    </footer>
  );
};

export default Footer;

//<a href="#" aria-label="Github"><FaGithub /></a>
// <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
// <a href="#" aria-label="Twitter"><FaTwitter /></a>