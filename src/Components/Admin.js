import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Appbar from './Appbar';
import { useEffect } from 'react';

export default function Admin() {
    const [userName, setuserName]=React.useState('');
    const [password, setpassword] = React.useState('');
    const navigate = useNavigate();
    const [message, setMessage] = React.useState(''); 
    const [error, setError] = React.useState('');
   
    
    useEffect(()=>{
      localStorage.setItem('isLoggedIn','false');
      
    })

    const handleClick = async (e) => {
        e.preventDefault();
        
        const admin={userName, password}
        const response = await fetch("/admin/loginAdmin",{
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(admin)
    });
    
    if (response.ok) 
    {  
      const message = await response.text();
      // Redirect to another page if login is successful
      // Use navigate function to redirect   
      displayMessage(message);
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        
        navigate('/dashboard');  // Navigate to login after 3 seconds
        }, 3000); // 3000 milliseconds = 3 seconds  
    } 
    else 
    {
      const error = await response.text();
     // setError("Login failed. Please check your credentials.");
      displayErrorMessage(error);
    }     
    };
    const displayMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
      };

      const displayErrorMessage = (msg) => {
        setError(msg);
        setTimeout(() => setError(''), 3000);
      };
  return (
    <Box  
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        width: '100vw',
        backgroundColor: 'rgba(255,255,255,0.5)',
        
        borderRadius: '10px',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}
      noValidate
      autoComplete="off"     
    >
        <h1 style={{color:"inherit"}}>Asia Automation admin Login</h1>
      <TextField id="outlined-basic" label="Username" variant="outlined" sx={{ m: 1, width: '40ch' }} value={userName} onChange={(e)=>setuserName(e.target.value)}/>
      <TextField
      
       id="outlined-basic"
       label="Password"
       variant="outlined"
       sx={{ m: 1, width: '40ch' }}
       value={password}
       onChange={(e) => setpassword(e.target.value)}
       type="password" // Set type attribute to "password"
      />
      <Button variant="contained" sx={{ m: 1, width: '40ch' }}onClick={handleClick}>Login</Button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      {message && <div style={{ color: "green", marginTop: "10px" }}>{message}</div>}
      
    </Box>
  );
}
