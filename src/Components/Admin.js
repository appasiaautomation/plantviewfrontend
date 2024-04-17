import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function BasicTextFields() {
    const [userName, setuserName]=React.useState('');
    const [password, setpassword] = React.useState('');
    const navigate = useNavigate();
    const [message, setMessage] = React.useState(''); 
    const [error, setError] = React.useState('');
    const handleClick = async (e) => {
        e.preventDefault();
        
        const admin={userName, password}
        const response = await fetch("/loginAdmin",{
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
      navigate('/admin/dashboard');  // Navigate to login after 3 seconds
        }, 3000); // 3000 milliseconds = 3 seconds  
    } 
    else 
    {
      setError("Login failed. Please check your credentials.");
    }     
    };
    const displayMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
      };
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}
      noValidate
      autoComplete="off"     
    >
        <h1 style={{color:"inherit"}}>Admin Login</h1>
      <TextField id="outlined-basic" label="Username" variant="outlined" sx={{ m: 1, width: '25ch' }} value={userName} onChange={(e)=>setuserName(e.target.value)}/>
      <TextField id="outlined-basic" label="Password" variant="outlined" sx={{ m: 1, width: '25ch' }} value={password} onChange={(e)=>setpassword(e.target.value)}/>
      <Button variant="contained" onClick={handleClick}>Submit</Button>
      {message && <div style={{ color: "green", marginTop: "10px" }}>{message}</div>}
    </Box>
  );
}
