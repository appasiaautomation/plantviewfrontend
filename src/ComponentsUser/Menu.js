import React, { useState } from 'react';

function Menu(){
    const [idleTime, setIdleTime] = useState('');
    const [alarmTime, setAlarmTime] = useState('');
    const [shiftTiming, setShiftTiming] = useState('');

     // Function to handle saving settings
  const handleSubmit = () => {
    // Save idleTime, alarmTime, and shiftTiming to backend or local storage
    console.log('Saved idle time:', idleTime);
    console.log('Saved alarm time:', alarmTime);
    console.log('Saved shift timing:', shiftTiming);
    // You can add logic here to send data to your backend or save to local storage
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
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Shift Timing</th>
        </tr>
      </thead>
      <tbody>
  <tr>
    <td style={{ border: '1px solid black', padding: '6px', height: '20px', width: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          value={idleTime} 
          onChange={(e) => setIdleTime(e.target.value)} 
          placeholder="Enter time" 
        />
        <span>Seconds</span>
      </div>
    </td>
    <td style={{ border: '1px solid black', padding: '6px', height: '20px', width: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          value={alarmTime} 
          onChange={(e) => setAlarmTime(e.target.value)} 
          placeholder="Enter time" 
        />
        <span>Seconds</span>
      </div>
    </td>
    <td style={{ border: '1px solid black', padding: '6px', height: '20px', width: '200px' }}>
      <select 
        value={shiftTiming} 
        onChange={(e) => setShiftTiming(e.target.value)}
        style={{ height: '100%', width: '100%' }}
      >
        <option value="">Select Shift Timing</option>
        <option value="6am to 2pm">6:00 AM  to 2:00 PM</option>
        <option value="2pm to 10pm">2:00 PM to 10:00 PM</option>
        <option value="10pm to 6am">10:00 PM  to 6:00 PM</option>
      </select>
    </td>
  </tr>
</tbody>

    </table>
    <div style={{ margin: '15px' }}>
      <button 
        onClick={handleSubmit} 
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Submit
      </button>
    </div>
  </div>
  
  );
}

export default Menu;
