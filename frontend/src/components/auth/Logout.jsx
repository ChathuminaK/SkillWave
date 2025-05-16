import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Logout = ({ variant = "text", color = "inherit", size = "medium" }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      
      // Update authentication state
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to home page after logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the server call fails, we want to clear local state
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
    >
      Logout
    </Button>
  );
};

export default Logout;
