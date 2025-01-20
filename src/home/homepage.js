import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./homepage.css"
import LogoutButton from '../components/logoutbutton';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className='home'> 
      <h2>Scooter App</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Welcome!</h1>
        <div className="button-container">
          <button onClick={() => handleNavigation('/register')}>Register</button>
          <button onClick={() => handleNavigation('/login')}>Login</button>
          <button onClick={() => handleNavigation('/admin')}>Admin Page</button>
          <button onClick={() => handleNavigation('/user')}>User Page</button>
          <LogoutButton />
        </div>
      </form>
    </div>
  );
};

export default HomePage;