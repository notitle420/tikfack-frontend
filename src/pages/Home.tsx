import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-layout">
      <div className="content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
