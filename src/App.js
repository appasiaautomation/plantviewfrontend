
// App.js
import React from 'react';
import './App.css';
import Appbar from './Components/Appbar';
import Admin from './Components/Admin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/dashboard';
import Users from './Components/Users';
import AddUser from './Components/addUser';
import Devices from './Components/Devices'; 
import AddDevices from './Components/addDevices'; 
import Protected from "./Protected";
import DevicesList from "./Components/DevicesList"
import EditUser from "./Components/editUser";
import EditDevice from './Components/EditDevice';
import UserApp from './ComponentsUser/UserApp';
import Menu from './ComponentsUser/Menu';
import UserLogin from './ComponentsUser/userLogin';

function App() {
  
  return (
    <div className="App">
      <div>
        <BrowserRouter>
        <Appbar/>
        <Routes>            
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<Protected Component={Dashboard} />} />
        <Route path="/admin/Users" element={<Protected Component={Users }  />} /> 
        <Route path="/admin/AddUser" element={<Protected Component={AddUser} />} /> 
        <Route path="/admin/devices" element={<Protected Component={Devices} />} />
        <Route path="/admin/addDevices" element={<Protected Component ={AddDevices} />} />   
        <Route path="/admin/devicesList/:userName" element={<Protected Component={DevicesList} /> }/>
        <Route path="/admin/editUser/:userName" element={<Protected Component={EditUser} /> }/>   
        <Route path="/admin/editDevice/:deviceId" element={<Protected Component={EditDevice} />} /> {/* Corrected route */}             
        </Routes>        
        </BrowserRouter>
        </div>
        <div>
        <BrowserRouter>
        <Routes>
        <Route path='/' element={<UserLogin/>} />
        <Route path="/User/userLogin" element={<UserLogin/>}/>
        <Route path="/User/UserApp" element={<Protected Component={UserApp}/>}/>
        <Route path="/User/Menu" element={<Protected Component={Menu}/>}/>
        </Routes> 
        </BrowserRouter>
        </div>     
    </div>  
  );

}

export default App;
