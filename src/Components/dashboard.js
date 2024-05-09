import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    
    const navigate = useNavigate();

const handleClickUsers = async (user) => {
    user.preventDefault();
    navigate('/admin/users');
};

const handleClickDevices = async (device) => {
    device.preventDefault();
    navigate('/admin/devices');
};

  return (
    <form>
    <h1 style={{ margin: '0', position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}> Welcome to Plantview Administration </h1>
    <Stack
      spacing={2}
      direction="row"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        
      }}
    >         
      <Button variant="contained" sx={{ width: '200px', height: '90px', top: '40%',fontSize: '1.5rem', }}onClick={handleClickUsers}>Manage Users</Button>
       <br/><br/>
      <Button variant="contained" sx={{ width: '200px', height: '90px',top: '40%',fontSize: '1.5rem' }}onClick={handleClickDevices}> Manage Devices</Button>      
    </Stack>
    </form>
  );
}
