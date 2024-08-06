import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import Autocomplete from "@mui/material/Autocomplete";

function AddDevices() {
    const [fieldValue, setFieldValue] = useState('');
    const [usernames, setUsernames] = useState([]);
    const [formData, setFormData] = useState({
        deviceId: "",
        machineName: "",
        startDate: new Date(),
        userName: "",
        status: false, // Assuming status is initially false
    });

    const navigate = useNavigate();

    const handleCheckboxChange = (event) => {
        setFormData({
            ...formData,
            Status: event.target.checked,
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate Device ID
        if (!isValidDeviceId(formData.deviceId)) {
            alert('Invalid Device ID. Please enter a valid Device ID.');
            return;
        }

        // Convert the date object to string or required format before sending
        const submissionData = {
            ...formData,
            u: { userName: formData.userName },
        };

        try {
            const response = await fetch('/admin/saveDevice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });
            if (response.ok) {
                const message = await response.text();
                alert(message);
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

    const isValidDeviceId = (deviceId) => {
        // Regular expression to validate hexadecimal Device ID with colons
        const regex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
        return regex.test(deviceId);
    };

    return (
        <div>
            <h1>Devices List</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="deviceId"
                    label="Device ID"
                    variant="outlined"
                    sx={{ m: 1, width: '25ch' }}
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
                <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    sx={{ m: 1, width: '25ch' }}
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <br />
                <Autocomplete
                    freeSolo
                    options={usernames}
                    onInputChange={(event, newValue) => {
                        setFieldValue(newValue); // Update the field value for fetching new usernames
                        setFormData({ ...formData, userName: newValue }); // Update formData only when input changes
                    }}
                    inputValue={fieldValue}
                    renderInput={(params) => (
                        <TextField {...params} label="User Name" variant="outlined" required sx={{ m: 1, width: "25ch" }} />
                    )}
                />
                <br />
                <FormControlLabel
                    control={<Checkbox checked={formData.Status} onChange={handleCheckboxChange} />}
                    label="Status"
                />
                <br />
                <Button type="submit" variant="contained" color="primary" sx={{ m: 1 }}>
                    Save Device
                </Button>
            </form>
        </div>
    );
}

export default AddDevices;
