import React, { useReducer, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./login.css"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();     
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      }); 
      
      const userRole = response.data.role;
      
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      
      
      if (userRole === 'admin') {
        console.log(userRole)
          navigate('/admin');
      } else if (userRole === 'user') {
          navigate('/user');
      }
      
      window.location.reload();
    } catch (err) {
      console.log(err)
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
      <div className='home'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <a href="/register">Register</a>
      </form>
      </div>
  );
}

export default Login;
