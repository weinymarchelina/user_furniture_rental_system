"use client";

import { Button } from "@mui/material";

const SignOutButton = () => {
  const handleSignOut = () => {
    // Delete the 'auth' cookie
    document.cookie = "auth=; Max-Age=0; path=/"; // This will delete the cookie
    window.location.href = "/"; // Redirect to home page
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
