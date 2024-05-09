// UsersPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Users() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [devicesCounts, setDevicesCounts] = useState({});
    const [message, setMessage] = useState('');
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("/getAllUsers"); // Adjust URL as needed
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        };
        fetchUsers();
    }, []);

    
    const handleClick = async(e) =>{
        e.preventDefault();
        navigate("/addUser");
    };

    const handleEdit = (userName) => {
        // Navigate to edit user page with user details
        navigate(`/editUser/${userName}`);
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
        // Send delete request to delete user by userName
        try {
            const response = await fetch(`/deleteUser?userName=${userName}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Update users state after deletion
                setUsers(users.filter(user => user.userName !== userName));
                const message = await response.text();
                alert(message);
            } else {
                alert('Failed to delete user');
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

    
    return (
        <div sx={{display:'flex', justifyContent:'center'}}>
            <h1 >Users List</h1>
            <table style={{ width: '50%', borderCollapse: 'collapse', marginLeft:'25%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Username</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Monitoring Password</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Analysis Password</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>No of Devices</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userName}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.userName}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.password_Mon}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user.password_Ana}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{devicesCounts[user.userName]}</td>                                                        
                            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(user.userName)}>Edit</Button>
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
