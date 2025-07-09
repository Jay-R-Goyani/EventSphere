import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin-profile', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/admin-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        // Clear all storages and cookies before setting new token
        localStorage.clear();
        sessionStorage.clear();
        // Remove all cookies
        document.cookie.split(';').forEach(cookie => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        });
        localStorage.setItem('adminToken', data.token);
        window.location.reload();
        // navigate('/admin-profile');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
            required
            autoComplete="current-password"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 