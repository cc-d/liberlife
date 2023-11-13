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

  const isLoginPage = window.location.pathname === "/login";
  const isSnapPage = window.location.pathname.startsWith("/snapshot");

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  useEffect(() => {
    if (isLoginPage) {
      return;
    } else if ((!auth || !auth.user) && !auth?.userLoading) {
      if (!window.location.pathname.startsWith("/snapshots")) {
        navigate("/login");
      }
    }
  }, [auth, navigate]);

  if (window.location.pathname === "/login") {
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
        variant="dense"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: `${theme.palette.background.default}`,
          color: `${theme.palette.text.primary}`,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            life.liberfy.ai
          </Typography>

          {isSnapPage ? (
            <Typography variant="h6">not logged in</Typography>
          ) : (
            auth?.user && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color="inherit"
                  aria-label="account of current user"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ mr: 2, color: "text.primary" }}
                >
                  {auth.user}
                </Typography>
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
