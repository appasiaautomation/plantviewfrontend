
import './App.css';
import Appbar from './Components/Appbar';
import Admin from './Components/Admin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/dashboard';
import Users from './Components/Users';
import AddUser from './Components/addUser';


function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Appbar/>
        <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} /> 
        <Route path="/Users" element={<Users />} /> 
        <Route path="/AddUser" element={<AddUser />} />    
        </Routes>
        </BrowserRouter>  
    </div>
  );
}

export default App;
