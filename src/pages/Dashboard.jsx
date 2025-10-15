import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to blog by default
    navigate('/dashboard/blog');
  }, [navigate]);

  return null;
};

export default Dashboard;