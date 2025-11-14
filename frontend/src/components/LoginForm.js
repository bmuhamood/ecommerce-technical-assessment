/**
 * LoginForm Component
 * Admin login form
 */

import React, { useState } from 'react';
import { login } from '../services/api';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await login(formData);
      
      if (response.success) {
        onLogin(response.token, response.user);
        setFormData({ email: '', password: '' });
      }
    } catch (error) {
      setErrors({ general: 'Invalid email or password' });
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Admin Login</h2>
      <p className="login-subtitle">Login to add and manage products</p>
      
      <form onSubmit={handleSubmit} className="login-form">
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="login-help">
        <p>Demo Credentials:</p>
        <p><strong>Email:</strong> admin@example.com</p>
        <p><strong>Password:</strong> admin123</p>
      </div>
    </div>
  );
};

export default LoginForm;