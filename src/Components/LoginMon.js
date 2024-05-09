import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function BasicTextFields() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState(''); 
    const [error, setError] = useState('');

    const handleChangeUserName = (e) => {
        setUserName(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        
        try {
            const admin = { userName, password };
            const response = await fetch("/admin/LoginMon",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(admin)
            });

            if (response.ok) {  
                const message = await response.text();
                displayMessage(message);
                localStorage.setItem('isLoggedIn', 'true');
                setTimeout(() => navigate('/admin/LoginMon'), 3000); 
            } else {
                const error = await response.text();
                displayErrorMessage(error);
            }
        } catch (error) {
            console.error('Error occurred during login:', error);
            displayErrorMessage('An error occurred during login. Please try again.');
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
            <h1 style={{ color: "inherit" }}>Asia Automation Admin Login</h1>
            <TextField 
                id="username"
                label="Username" 
                variant="outlined" 
                sx={{ m: 1, width: '40ch' }} 
                value={userName} 
                onChange={handleChangeUserName}
            />
            <TextField
                id="password"
                label="Password"
                variant="outlined"
                sx={{ m: 1, width: '40ch' }}
                value={password}
                onChange={handleChangePassword}
                type="password"
            />
            <Button variant="contained" sx={{ m: 1, width: '40ch' }} onClick={handleClick}>Login</Button>
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
            {message && <div style={{ color: "green", marginTop: "10px" }}>{message}</div>}
        </Box>
    );
}
