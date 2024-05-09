import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';  // Correct import for the adapter
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

function EditUser(){

    const location = useLocation();
    const { user } = location.state || {}; // Access user data passed from the previous page
    const navigate= useNavigate();

    const [formData, setFormData] = useState({
        userName: user.userName || '',
        plantName: user.plantName || '',
        location: user.location || '',
        creationDate: user.creationDate ? new Date(user.creationDate) : new Date(),
        validity: user.validity ? new Date(user.validity) : new Date(),
        userName_Mon: user.userName_Mon || '',
        password_Mon: user.password_Mon || '',
        userName_Ana: user.userName_Ana || '',
        password_Ana: user.password_Ana || '',
        address: user.address || '',
        mobileNumber: user.mobileNumber || '',
        emailId: user.emailId || '',
        dailyReport: user.dailyReport || false,
        reportTime: user.reportTime || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
  
    const handleDateChange = (name, newValue) => {
        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleCheckboxChange = (event) => {
        setFormData({
            ...formData,
            dailyReport: event.target.checked,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Convert the date object to string or required format before sending
        const submissionData = {
            ...formData,
            creationDate: formData.creationDate.toISOString().split('T')[0],
            validity: formData.validity.toISOString().split('T')[0],        
        };
        try {
            const response = await fetch('/admin/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });
            if (response.ok) {
                const message = await response.text();
                alert(message);
                navigate(-1);
                
                // Optionally reset form fields after successful submission
                // resetFormData();
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('An error occurred while saving user');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div >
                <h2>Update User</h2>
                <form onSubmit={handleSubmit} >
                    <TextField
                        id="userName"
                        label="Username"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch', pointerEvents: 'none' }}
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        disabled
                        
                    />
                    <TextField
                        id="plantName"
                        label="Plant Name"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="plantName"
                        value={formData.plantName}
                        onChange={handleChange}
                    />
                    <TextField
                        id="location"
                        label="Location"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <br />
                    <DesktopDatePicker
                        label="Creation Date"
                        inputFormat="MM/dd/yyyy"
                        value={formData.creationDate}
                        onChange={(newValue) => handleDateChange('creationDate', newValue)}
                        renderInput={(params) => <TextField {...params} sx={{ m: 1, width: '25ch' }} />}
                    />
                    <DesktopDatePicker
                        label="Validity"
                        inputFormat="MM/dd/yyyy"
                        value={formData.validity}
                        onChange={(newValue) => handleDateChange('validity', newValue)}
                        renderInput={(params) => <TextField {...params} sx={{ m: 1, width: '25ch' }} />}
                    />
                    <br />
                    <TextField
                        id="userName_Mon"
                        label="Username for Monitoring"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="userName_Mon"
                        value={formData.userName_Mon}
                        onChange={handleChange}
                    />
                    <TextField
                        id="password_Mon"
                        label="Password for Monitoring"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="password_Mon"
                        value={formData.password_Mon}
                        onChange={handleChange}
                    />
                    <br />
                    <TextField
                        id="userName_Ana"
                        label="Username for Analysis"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="userName_Ana"
                        value={formData.userName_Ana}
                        onChange={handleChange}
                    />
                    <TextField
                        id="password_Ana"
                        label="Password for Analysis"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="password_Ana"
                        value={formData.password_Ana}
                        onChange={handleChange}
                    />
                    <br />
                    <TextField
                        id="address"
                        label="Address"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <TextField
                        id="mobileNumber"
                        label="Mobile Number"
                        variant="outlined"
                        type="number"
                        sx={{ m: 1, width: '25ch' }}
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        id="emailId"
                        label="Email ID"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                    />
                    <br />
                    <FormControlLabel
                        control={<Checkbox checked={formData.dailyReport} onChange={handleCheckboxChange} />}
                        label="Daily Report"
                    />
                    <TextField
                        id="reportTime"
                        label="Report Time"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                         name="reportTime"
                        type="time" // Set the type to "time"
                        placeholder="HH:MM" // Placeholder text
                        value={formData.reportTime}
                         onChange={handleChange}
                        InputLabelProps={{
                         shrink: true, // Ensures the label doesn't overlap with the input value
                          }}
                        inputProps={{
                         step: 300, // 5 minutes step (optional, customize as needed)
                            }}
/>                  
                    <br />
                    <Button type="submit" variant="contained" color="primary" sx={{ m: 1 }}>
                        Save User
                    </Button>
                </form>
            </div>
        </LocalizationProvider>
    );
}

export default EditUser;   