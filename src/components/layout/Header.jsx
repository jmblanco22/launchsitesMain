import React from 'react';
import { FaRocket } from 'react-icons/fa';

const Header = () => {
  const navItems = ['services', 'features', 'portfolio', 'pricing', 'contact'];

  return (
    <header className="header">
      {/* fix the double "a" typo and keep it simple */}
      <a href="/" className="logo-btn" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <FaRocket />
        Launchsites
      </a>

      <nav className="header-nav">
        {navItems.map((item) => (
          <a
            key={item}
            href={`/#${item}`}           // <-- works from ANY page, including /pricing
            className="nav-link"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
