"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to avoid flicker on initial render

  useEffect(() => {
    // Check for the 'auth' cookie on the client-side after the initial render
    const authCookie = Cookies.get("auth");
    setIsAuthenticated(!!authCookie); // Update state based on the existence of the cookie
  }, []);

  // If isAuthenticated is null, it means we're still checking the cookie, so don't render anything yet
  if (isAuthenticated === null) return null;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#f5f5f5",
        boxShadow: "none",
        padding: "0.5rem 1rem",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <img
            src="/logo_crop.png"
            alt="FlexiFurnish Logo"
            style={{ height: "50px", width: "50px" }}
          />
          {isAuthenticated ? (
            <Typography
              variant="h6"
              color="primary"
              component={Link}
              href="/"
              sx={{
                fontWeight: "bold",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              FlexiFurnish
            </Typography>
          ) : (
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: "bold",
              }}
            >
              FlexiFurnish
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: "1rem" }}>
          {isAuthenticated ? (
            <>
              <Button component={Link} href="/">
                Home
              </Button>
              <Button component={Link} href="/product">
                Products
              </Button>
              <Button component={Link} href="/delivery">
                Deliveries
              </Button>
              <Button component={Link} href="/user">
                User
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} href="/register">
                Register
              </Button>
              <Button component={Link} href="/login">
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
