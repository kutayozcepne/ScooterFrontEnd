import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login';
import AdminPage from './admin/adminpage';
import UserPage from './user/userpage';
import Register from './components/register';
import HomePage from './home/homepage';


const App = () => {
  
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const getUserRole = () => {
    const role = localStorage.getItem('role');
    return role;
  };

  return (
 
    <Router>
        <Routes>
          <Route
              path="/login"
              element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
          />
          <Route
              path="/admin"
              element={isAuthenticated() && getUserRole() === 'admin' ? (
                  <AdminPage />
              ) : (
                  <Navigate to="/login" />
              )}
          />
          <Route
              path="/user"
              element={isAuthenticated() ? (
                  <UserPage />
              ) : (
                  <Navigate to="/login" />
              )}
          />
          <Route
              path="/"
              element={<HomePage/>}
          />
          <Route path="/register" element={ <Register/>}/>
      </Routes>
  </Router>
  
  );
};

export default App;
