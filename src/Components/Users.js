import { Margin } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Users() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [devicesCounts, setDevicesCounts] = useState({});
    const [devicesList, setDevicesList] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("/admin/getAllUsers"); // Adjust URL as needed
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        };
        fetchUsers();
    }, []);
        
    const handleClick = async (e) => {
        e.preventDefault();
        navigate("/admin/addUser");
    };

    const handleEdit = (userName, userData) => {
        // Navigate to edit user page with user details
        navigate(`/admin/editUser/${userName}`, { state: { user: userData } });
    };
    




    const getDevices = async(userName) =>{

        const response = await fetch(`/getUserDevices?userName=${userName}`, {
            method:'GET'
            }); // Adjust URL as needed
        if(response.ok){
            const data = await response.json();
            return data.length;
        }
        return 0;
    }

    const handleDelete = async (userName) => {
        // Confirm with the user before proceeding with deletion
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (!confirmed) {
            // If the user cancels deletion, return early
            return;
        }
    
        try {
            const response = await fetch(`/admin/deleteUser?userName=${userName}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Update users state after deletion
                const message= await response.text();
                setUsers(users.filter(user => user.userName !== userName));
                alert(message);
            } else {
                const error = await response.text();             
                alert(error);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting user');
        }
    };
    
           
    useEffect(() => {
        const fetchDevicesCounts = async () => {
            const counts = {};
            for (const user of users) {
                const count = await getDevices(user.userName);
                counts[user.userName] = count;
            }
            setDevicesCounts(counts);
        };
        fetchDevicesCounts();
    }, [users]); // Trigger fetchDevicesCounts when users change

    const handleDevicesClick = async (userName) => {
        const response = await fetch(`/admin/getUserDevices?userName=${userName}`);
        if (response.ok) {
            const data = await response.json();
            navigate(`/admin/devicesList/${userName}`, { state: { devices: data } });
        } else {
            console.error('Failed to fetch devices:', response.statusText);
        }
    };
    

    return (
        <div>
            <h1>Users List</h1>
            <table style={{ width: '80%', borderCollapse: 'collapse', marginLeft: '12%'  }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Username</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Monitoring Password</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Analysis Password</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>No of Devices</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Validity</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userName}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.userName}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.password_Mon}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.password_Ana}</td>
                            <td
                                style={{ border: '1px solid black', padding: '8px', cursor: 'pointer' }}
                                onClick={() => handleDevicesClick(user.userName)}
                            >
                                {devicesCounts[user.userName]}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.validity}</td>
                            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(user.userName, user)}>Edit</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(user.userName)}>Delete</Button>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <Button variant="contained" onClick={handleClick}>Add New User</Button>

           
            
        </div>
    );
}

export default Users;
