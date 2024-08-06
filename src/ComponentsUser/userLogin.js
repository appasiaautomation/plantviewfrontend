import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';

function UserLogin() {
  const [userName_Mon, setUserName] = useState("");
  const [password_Mon, setpassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    let response;
    const users = { userName_Mon, password_Mon };
    if (userName_Mon.endsWith("_mon")) {
      response = await fetch("/user/loginMon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      });
    } else {
      response = await fetch("/admin123", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      });
    }
    
    if (response.ok) {    
      const data= await response.json();
      
      // Redirect to another page if login is successful
      // Use navigate function to redirect
      
      displayMessage("Login successful !");
      const userName = data.userName;
      const location = data.location;
      const plantName = data.plantName;  
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");       
        navigate("/User/UserApp", { state: { userName, userLocation: location, plantName } }); // Navigate to login after 3 seconds
      }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      const error = await response.text();
      // setError("Login failed. Please check your credentials.");
      displayErrorMessage(error);
    }
  };
  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const displayErrorMessage = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  return (
    <Box  
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        width: '100vw',
        backgroundColor: 'rgba(255,255,255,0.5)',
        
        borderRadius: '10px',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}
      noValidate
      autoComplete="off"     
    >
      <h1>User Login</h1>
    <div>
      <TextField
        id="outlined-basic"
        label="Username"
        variant="outlined"
        sx={{ m: 1, width: "40ch" }}
        value={userName_Mon}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br></br>
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        sx={{ m: 1, width: "40ch" }}
        value={password_Mon}
        onChange={(e) => setpassword(e.target.value)}
        type="password" // Set type attribute to "password"
      />
      <br></br>
      <Button
        variant="contained"
        sx={{ m: 1, width: "40ch" }}
        onClick={handleClick}
      >
        Login
      </Button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      {message && (
        <div style={{ color: "green", marginTop: "10px" }}>{message}</div>
      )}
    </div>
    </Box>
  );
}

export default UserLogin;
