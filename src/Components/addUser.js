<<<<<<< HEAD
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';  // Correct import for the adapter
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


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
=======
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"; // Correct import for the adapter
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Box from "@mui/material/Box";

function UserForm() {
  const [formData, setFormData] = useState({
    userName: "",
    plantName: "",
    location: "",
    creationDate: new Date(),
    validity: new Date(),
    userName_Mon: "",
    password_Mon: "",
    userName_Ana: "",
    password_Ana: "",
    address: "",
    mobileNumber: "",
    emailId: "",
    dailyReport: false,
    reportTime: "",
  });

   
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
>>>>>>> 8171e474437dd27e0cc7c97caf58f0d1d98a0a58
    });
  };

  const handleDateChange = (name, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue,
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
      creationDate: formData.creationDate.toISOString().split("T")[0],
      validity: formData.validity.toISOString().split("T")[0],
    };
    try {
      const response = await fetch("/saveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      if (response.ok) {
        const message = await response.text();
        alert(message);
        setFormData({
          userName: "",
          plantName: "",
          location: "",
          creationDate: new Date(),
          validity: new Date(),
          userName_Mon: "",
          password_Mon: "",
          userName_Ana: "",
          password_Ana: "",
          address: "",
          mobileNumber: "",
          emailId: "",
          dailyReport: false,
          reportTime: "",
        });
<<<<<<< HEAD
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
            const response = await fetch('/admin/saveUser', {
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
    
    const validateMobileNumber = (value) => {
        // Regular expression to match 10 digits only
        const mobileNumberRegex = /^\d{10}$/;
        return mobileNumberRegex.test(value);
    };
    
     
    const validateEmail = (value) => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
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
                        type="tel" 
                        sx={{ m: 1, width: '25ch' }}
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        inputProps={{ minLength: 10 , maxLength: 10}} // Specify the minimum length
                        error={!validateMobileNumber(formData.mobileNumber)} // Check if mobile number is invalid
                        helperText={!validateMobileNumber(formData.mobileNumber) ? 'Please enter a valid 10-digit mobile number' : ''}
                    />

                    <TextField
                        id="emailId"
                        label="Email ID"
                        variant="outlined"
                        sx={{ m: 1, width: '25ch' }}
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        inputProps={{
                            maxLength: 50, // Specify the maximum length for the email
                            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', // Email validation pattern
                        }}
                        error={!validateEmail(formData.emailId)} // Check if email is invalid
                        helperText={!validateEmail(formData.emailId) ? 'Enter a valid email address' : ''}
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
    
=======
        // Optionally reset form fields after successful submission
        // resetFormData();
      } else {
        alert("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("An error occurred while saving user");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            width: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "10px",
            boxShadow:
              "0 0 10px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <h2>Create User</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              id="userName"
              label="Username"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
            <TextField
              id="plantName"
              label="Plant Name"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="plantName"
              value={formData.plantName}
              onChange={handleChange}
            />
            <TextField
              id="location"
              label="Location"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <br />
            <DesktopDatePicker
              label="Creation Date"
              inputFormat="MM/dd/yyyy"
              value={formData.creationDate}
              onChange={(newValue) =>
                handleDateChange("creationDate", newValue)
              }
              renderInput={(params) => (
                <TextField {...params} sx={{ m: 1, width: "25ch" }} />
              )}
            />
            <DesktopDatePicker
              label="Validity"
              inputFormat="MM/dd/yyyy"
              value={formData.validity}
              onChange={(newValue) => handleDateChange("validity", newValue)}
              renderInput={(params) => (
                <TextField {...params} sx={{ m: 1, width: "25ch" }} />
              )}
            />
            <br />
            <TextField
              id="userName_Mon"
              label="Username for Monitoring"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="userName_Mon"
              value={formData.userName_Mon}
              onChange={handleChange}
            />
            <TextField
              id="password_Mon"
              label="Password for Monitoring"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="password_Mon"
              value={formData.password_Mon}
              onChange={handleChange}
            />
            <br />
            <TextField
              id="userName_Ana"
              label="Username for Analysis"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="userName_Ana"
              value={formData.userName_Ana}
              onChange={handleChange}
            />
            <TextField
              id="password_Ana"
              label="Password for Analysis"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="password_Ana"
              value={formData.password_Ana}
              onChange={handleChange}
            />
            <br />
            <TextField
              id="address"
              label="Address"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <TextField
              id="mobileNumber"
              label="Mobile Number"
              variant="outlined"
              type="number"
              sx={{ m: 1, width: "25ch" }}
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
            <TextField
              id="emailId"
              label="Email ID"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
            />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.dailyReport}
                  onChange={handleCheckboxChange}
                />
              }
              label="Daily Report"
            />
            <TextField
              id="reportTime"
              label="Report Time"
              variant="outlined"
              sx={{ m: 1, width: "25ch" }}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ m: 1 }}
            >
              Save User
            </Button>
          </form>
        </Box>
      </div>
    </LocalizationProvider>
  );
>>>>>>> 8171e474437dd27e0cc7c97caf58f0d1d98a0a58
}

export default UserForm;
