import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  
import "./logoutbutton.css"

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        
      
      
      try {
        const response = await axios.post('http://localhost:5000/auth/logout',{}, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        

        if (response.status == 200) {
            console.log('Successfully logged out');
        } else {
            console.error('Failed to log out');
        }
      } catch (error) {
          console.error('Error during logout:', error);
      }
      localStorage.removeItem('token'); 
      navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
};

export default LogoutButton;
