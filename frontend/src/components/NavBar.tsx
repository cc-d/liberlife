import React, { useContext, useEffect } from "react";
import useTheme from "@mui/material/styles/useTheme";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // User icon
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const theme = useTheme();

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!auth || !auth.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  if (!auth || !auth.user) {
    return null;
  }

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: 0,
      }}

    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: `${theme.palette.background.default}`,
          color: `${theme.palette.text.primary}`,

        }}

      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          life.liberfy.ai
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" aria-label="account of current user">
            <AccountCircleIcon />
          </IconButton>
          <Typography variant="body1" sx={{ mr: 2, color: "text.primary" }}>
            {auth.user}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
