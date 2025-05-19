import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className="nav-item">
        Home
      </NavLink>
      <NavLink to="/search" className="nav-item">
        Search
      </NavLink>
    </nav>
  );
};

export default BottomNav;
