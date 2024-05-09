import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Appbar() {
  const navigate = useNavigate();
  const location = useLocation();
   
  // Prevent going back from the dashboard page
  React.useEffect(() => {
    if (location.pathname === '/admin/dashboard') {
      const handleBackButton = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener('popstate', handleBackButton);
      return () => window.removeEventListener('popstate', handleBackButton);
    }
  }, [location.pathname]);
      
  const handleBack = () => {
    if (location.pathname !== '/admin/dashboard') {
      navigate(-1);
    }
  };
  const getTitle = () => {
    if (location.pathname.startsWith('/admin')) {
      return 'Asia Automation Plantview Administrator';
    } else {
      return 'Asia Automation Plantview';
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    navigate('/admin');
  };

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Check if the user is logged in

  return (
    <Box sx={{ flexGrow: 1 }}>
       <AppBar position="static" sx={{ height: '100px', padding: '20px' }}> 
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            
            onClick={handleBack}
          >          
            <ArrowBackIcon sx={{ fontSize: '2rem' }} /> 
          </IconButton>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {getTitle()}
          </Typography>
          {isLoggedIn && location.pathname === '/admin/dashboard' ?  ( // Conditionally render Logout button if isLoggedIn is true
            <Button color="inherit" sx={{ fontSize: '1rem' }} onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit">Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
