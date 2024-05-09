import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function DevicesList() {
    const location = useLocation();
    const { devices } = location.state || {};
    const [devicesList, setDevicesList] = useState([]);
    const associatedUser = devicesList.length > 0 ? devicesList[0].u?.userName : null;

    useEffect(() => {
        if (devices) {
            setDevicesList(devices);
        }
    }, [devices]);

    return (
        <div>
            <h1>Devices List for {associatedUser}</h1>
            <table style={{ width: '50%', borderCollapse: 'collapse', marginLeft: '25%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Device ID</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Machine name</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Machine location</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Start Date</th>
                        <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Active/Inactive</th>
                    </tr>
                </thead>
                <tbody>
                    {devicesList.map(device => (
                        <tr key={device.deviceId}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.deviceId}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.machineName}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.machineLocation}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.startDate}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{device.status ? 'Active' : 'Inactive'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DevicesList;
