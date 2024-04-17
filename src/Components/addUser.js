import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';  // Correct import for the adapter
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers';
import { AlignHorizontalLeft } from '@mui/icons-material';



function UserForm() {
    const [formData, setFormData] = useState({
        userName: '',
        plantName: '',
        location: '',
        creationDate: new Date(),
        validity: new Date(),
        userName_Mon: '',
        password_Mon: '',
        userName_Ana: '',
        password_Ana: '',
        address: '',
        mobileNumber: '',
        emailId: '',
        dailyReport: false,
        reportTime: '',
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
            const response = await fetch('/saveUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });
            if (response.ok) {
                alert('User saved successfully!');
                // Optionally reset form fields after successful submission
                // resetFormData();
            } else {
                alert('Failed to save user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('An error occurred while saving user');
        }
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
    

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div >
                <h2>Create User</h2>
                <form onSubmit={handleSubmit} >
                    <TextField
                        id="userName"
                        label="Username"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
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

export default UserForm;
