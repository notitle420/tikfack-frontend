import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Top from './pages/Top';
import VideoPage from './pages/VideoPage';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}> 
          <Route path="top" element={<Top />} />
          <Route path="search" element={<Search />} />
        </Route>
        <Route path="/video/:id" element={<VideoPage />} />
      </Routes>
    </Router>
  );
}

export default App;