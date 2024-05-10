
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Devices() {
    const [devices, setDevices] = useState([]);
    const navigate = useNavigate();
    const [deleteDeviceId, setDeleteDeviceId] = useState(null);
    useEffect(() => {
        const fetchDevices = async () => {
            const response = await fetch("/admin/getAllDevices"); // Adjust URL as needed
            if (response.ok) {
                const data = await response.json();
                setDevices(data);
            }
        };
        fetchDevices();
    }, []);

    const handleClick = async (e) => {
        e.preventDefault();
        navigate("/admin/addDevices");
    };

    const handleEdit = (deviceId, devicedata) => {
        // Navigate to edit user page with user details
        navigate(`/admin/editDevice/${deviceId}`, { state: { device: devicedata} });
    };

    const handleDelete =  (deviceId) => {
        const confirmed = window.confirm('Are you sure you want to delete this Device?');
        if (confirmed) {
            try {
                fetch(`/admin/deleteDevice?deviceId=${deviceId}`, {
                    method: 'DELETE'
                })
                .then(async response => {
                    if (response.ok) {
                        const message= await response.text();
                        setDevices(devices.filter(device => device.deviceId !== deviceId));
                        alert(message);
                    } else {
                        const error = await response.text();
                        alert(error);
                    }
                })              
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('An error occurred while deleting user');
            }
        }
    };

    return (
        <div sx={{ display: 'flex', justifyContent: 'center' }}>
            <h1 >Devices List</h1>
            <table style={{ width: '50%', borderCollapse: 'collapse', marginLeft: '25%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Device ID</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Associated User</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Start Date</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Active/Inactive</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map(device => (
                        <tr key={device.deviceId}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.deviceId}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.u ? device.u.userName : 'N/A'}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.startDate}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.status ? 'Active' : 'Inactive'}</td> 
                            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(device.deviceId, device)}>Edit</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(device.deviceId)}>Delete</Button>
                        </tr>
                    ))}
                </tbody>

            </table>
            <br />         
            <Button variant="contained" onClick={handleClick}>Add New Device</Button>       
        </div>
        
    );
}

export default Devices;
