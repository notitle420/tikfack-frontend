import React from 'react';
import { NavLink,} from 'react-router-dom';
import './BottomNav.css';
import keycloak from "../auth/keycloak"

const BottomNav: React.FC = () => {

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };
  return (
    <nav className="bottom-nav">
      <NavLink to="/top" end className="nav-item">
        Home
      </NavLink>
      <NavLink to="/search" className="nav-item">
        Search
      </NavLink>
      <button className="nav-item" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default BottomNav;
