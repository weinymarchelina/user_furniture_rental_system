"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SignOutButton from "../ui/SignOutButton";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from "@mui/material";

const GetCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const getUserInfo = async () => {
    try {
      const response = await fetch("/api/users/get");

      if (!response.ok) {
        throw new Error("Failed to fetch user info: " + response.status);
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setUser(data.user);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const afterLoginCookie = Cookies.get("afterLogin");

    if (afterLoginCookie) {
      Cookies.remove("afterLogin");

      window.location.reload();
    } else {
      getUserInfo();
    }
  }, []);

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Info
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {user.uName}
          </Typography>
          <Typography variant="body1">
            <strong>Phone Number:</strong> {user.uPhone_Num}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <SignOutButton />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GetCurrentUser;
