import React from 'react';
import { FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

const Header = () => {
  
  const navItems = ['services', 'features', 'portfolio', 'pricing', 'contact'];

  return (

    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <a a href="/" className="logo-btn" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <FaRocket />
        Launchsites
      </a>
      <nav className="header-nav">
        {navItems.map(item => (
          <Link
            key={item}
            to={item}
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            activeClass="active"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Link>
        ))}
      </nav>
    </motion.header>
  );
};

export default Header;

