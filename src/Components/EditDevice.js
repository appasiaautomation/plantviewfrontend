// EditDevice.js

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Autocomplete from "@mui/material/Autocomplete";
function EditDevice() {
    const [fieldValue, setFieldValue] = useState('');
    const location = useLocation();
    const [usernames, setUsernames] = useState([]);
    const { device } = location.state || {};
    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        deviceId: device.deviceId || '',
        machineName: device.machineName || '',
        machineLocation: device.machineLocation || '',
        startDate: device.startDate ? new Date(device.startDate) : new Date(),
        userName: device.u && typeof device.u === 'object' && device.u.userName ? device.u.userName : '',

        status: device.status || false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleDateChange = (name, newValue) => {
        setFormData({
            ...formData,
            [name]: newValue
        });
    };
    useEffect(() => {
        if (fieldValue === "") return;
        fetchUsernames(fieldValue);
    }, [fieldValue]);

    const fetchUsernames = async (value) => {
        try {
            const response = await fetch(`/admin/listUsers?search=${value}`);
            if (response.ok) {
                const data = await response.json();
                setUsernames(data);
            } else {
                setUsernames([]);
            }
        } catch (error) {
            console.error("Error fetching usernames:", error);
            setUsernames([]);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            u: { userName: formData.userName },
            //startDate: formData.startDate.toISOString().split('T')[0],
        };
        try {
            const response = await fetch('/admin/updateDevice', {
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
            } else {
                const Error = await response.text()
                alert(Error);
            }
        } catch (error) {
            console.error('Error saving device:', error);
            alert('An error occurred while saving device');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>
                <h2>Edit Device</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        id="deviceId"
                        label="Device ID"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch', pointerEvents: 'none' }}

                        name="deviceId"
                        value={formData.deviceId}
                        onChange={handleChange}

                    />
                    <br />
                    <TextField
                        id="machineName"
                        label="Machine Name"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="machineName"
                        value={formData.machineName}
                        onChange={handleChange}
                    />
                    <br />
                    <TextField
                        id="machineLocation"
                        label="Machine Location"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="machineLocation"
                        value={formData.machineLocation}
                        onChange={handleChange}
                    />

                    <br />
                    <DesktopDatePicker
                        label="Start Date"
                        inputFormat="MM/dd/yyyy"
                        value={formData.startDate}
                        sx={{ m: 1, width: '25ch' }}
                        onChange={(newValue) => handleDateChange('startDate', newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <br />
                    <Autocomplete
                        freeSolo
                        options={usernames}
                        onInputChange={(event, newValue) => {
                            setFieldValue(newValue); // Update the field value for fetching new usernames
                        }}
                        inputValue={fieldValue}
                        value={formData.userName}
                        onChange={(event, newValue) => {
                            setFormData({ ...formData, userName: newValue });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="User Name" variant="outlined" required sx={{ m: 1, width: "25ch" }} />
                        )}
                    />
                    <br />

                    <br />
                    <FormControlLabel
                        control={<Checkbox checked={formData.status} onChange={handleChange} name="status" />}
                        label="Status"
                    />
                    <br />
                    <Button type="submit" variant="contained" color="primary">
                        Save Device
                    </Button>
                </form>
            </div>
        </LocalizationProvider>
    );
}

export default EditDevice;
