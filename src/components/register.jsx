import React, { useState } from 'react';
import axios from 'axios';
import "./register.css"

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/register', formData);
      console.log(response.data);
      alert('Registration successful');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Registration failed');
    }
  };

  return (
    
      <div className='home'>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      <button type="submit">Register</button>
      <a href="/login">Login</a>
      </form>
      </div>
    
  );
};

export default Register;
