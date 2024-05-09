import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Appbar from "./Components/Appbar";
import Admin from "./Components/Admin";
import Dashboard from "./Components/dashboard";
import Users from "./Components/Users";
import AddUser from "./Components/addUser";
import Devices from "./Components/Devices";
import Protected from "./Components/Protected";
import AddDevice from "./Components/addDevice";

function App() {
    return (
        <div className="App">
            <Router>
                <Appbar />
                <Routes>
                    <Route path="/" element={<Admin />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/dashboard" element={<Protected Component={Dashboard} />} />
                    <Route path="/users" element={<Protected Component={Users} />} />
                    <Route path="/adduser" element={<Protected Component={AddUser} />} />
                    <Route path="/devices" element={<Protected Component={Devices} />} />
                    <Route path="/addDevice" element={<Protected Component={AddDevice} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
