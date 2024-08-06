import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';

function Menu() {
  const location = useLocation();
  const { devices } = location.state || {};
  const [devicesList, setDevicesList] = useState([]);

  useEffect(() => {
    if (devices) {
      setDevicesList(devices.map(device => ({
        ...device,
        idleTime: device.idleTime || '',
        alarmTime: device.alarmTime || ''
      })));
    }
  }, [devices]);

  const handleChange = (index, field, value) => {
    const updatedDevices = [...devicesList];
    updatedDevices[index][field] = value;
    setDevicesList(updatedDevices);
  };

  const handleSubmit = async () => {
    try {
      
      const response = await fetch('/user/updateDevice', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devicesList),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Saved settings:', responseData);
        alert(responseData.message);  // Use the message from the response
      } else {
        const errorText = await response.text();
        console.error('Failed to update devices:', response.statusText);
        console.error('Error details:', errorText);
        alert(`Failed to update devices: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating devices:', error);
      alert('Error updating devices');
    }
  };

  return (
    <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ textAlign: 'center' }}>Menu</h2>
      <table>
        <thead>
          <tr style={{ border: '1px solid #dddddd', padding: '8px' }}>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Machine Name</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Idle Time</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Alarm Time</th>
          </tr>
        </thead>
        <tbody>
          {devicesList.map((device, index) => (
            <tr key={device.deviceId}>
              <td style={{ border: '1px solid black', padding: '6px', height: '20px', width: '200px' }}>
                {device.machineName}
              </td>
              <td style={{ border: '1px solid black', padding: '6px', height: '20px', width: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={device.idleTime}
                    onChange={(e) => handleChange(index, 'idleTime', e.target.value)}
                    placeholder="Enter time"
                  />
                  <span>Seconds</span>
                </div>
              </td>
              <td style={{ border: '1px solid black', padding: '6px', height: '20px', width: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={device.alarmTime}
                    onChange={(e) => handleChange(index, 'alarmTime', e.target.value)}
                    placeholder="Enter time"
                  />
                  <span>Seconds</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ margin: '15px' }}>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default Menu;
