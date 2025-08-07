import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate('/login')}
          className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <FaUser className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-medium hidden md:block">
          {user.name}
        </span>
      </button>
      <button
        onClick={handleLogout}
        className="text-gray-700 hover:text-red-600 transition-colors"
        title="Sign Out"
      >
        <FaSignOutAlt className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UserProfile; 