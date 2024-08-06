import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Appbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = React.useState(location.pathname);

  React.useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);


  // Prevent going back from the dashboard page
  React.useEffect(() => {
    if (pathname === "/admin/dashboard") {
      const handleBackButton = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", handleBackButton);
      return () => window.removeEventListener("popstate", handleBackButton);
    }
  }, [pathname]);

  const handleBack = () => {
    if (pathname !== "/admin/dashboard") {
      navigate(-1);
    }
  };

  React.useEffect (() => {
    if(pathname === "/admin") {
      localStorage.removeItem("isLoggedIn");
    }
  },[pathname]);
  
  React.useEffect (() => {
    if(pathname === "/" || pathname === "/admin") {
      localStorage.removeItem("isLoggedIn");
    }
  },[pathname]);
  

  const handleMenu = () => {};
  const getTitle = () => {
    if (location.pathname.startsWith("/admin")) {
      return "Asia Automation Plantview Administrator";
    } else {
      return "Asia Automation Plantview";
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    navigate("/admin");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ height: "100px", padding: "20px" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleBack}
          >
            <ArrowBackIcon sx={{ fontSize: "2rem" }} />            
          </IconButton>

          {pathname === "/user/UserApp" ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenu}
            >
              <MenuIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          ) : null
            }

          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            {getTitle()}
          </Typography>
          {location.pathname.startsWith("/admin/") ? ( // Conditionally render Logout button if isLoggedIn is true
            <Button
              color="inherit"
              sx={{ fontSize: "1rem" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button color="inherit">Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
