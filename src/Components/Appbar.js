import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


export default function Appbar() {
  const navigate= useNavigate(); // Initialize useHistory hook
  const isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
  const location=useLocation();
  const islocation=(location.pathname=='/admin' || location.pathname=='/');

  const handleGoBack = () => {
    navigate(-1)// Navigate to the previous window
    if(navigate.name=='/admin' || navigate.name =='/'){
      localStorage.removeItem('isLoggedIn')
    }
    
  };

  // useEffect(() => {
  //   if(localStorage.getItem('isLoggedIn')){
      
  //   }
  // })
  
  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn'); 
    navigate('/admin');
  };


  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleGoBack}>
              <ArrowBackIcon />          
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6" component="div">
              Admin Login
            </Typography>
          </Box>
          {isLoggedIn&&islocation&&(
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}                                  
        </Toolbar>
      </AppBar>
    </Box>
  );
}
