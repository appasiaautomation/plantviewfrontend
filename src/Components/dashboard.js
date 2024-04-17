import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    
    const navigate = useNavigate();

const handleClickUsers = async (user) => {
    user.preventDefault();
    navigate('/users');
};

const handleClickDevices = async (device) => {
    device.preventDefault();
    navigate('/devices');
};

  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Button variant="contained" onClick={handleClickUsers}>Users</Button>
      <br></br>
      <Button variant="contained" onClick={handleClickDevices}>Devices</Button>      
    </Stack>
  );
}
