import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Top from './pages/Top';
import VideoPage from './pages/VideoPage';
import Search from './pages/Search';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="top"
            element={
              <PrivateRoute>
                <Top />
              </PrivateRoute>
            }
          />
          <Route
            path="search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/video/:id"
          element={
            <PrivateRoute>
              <VideoPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;