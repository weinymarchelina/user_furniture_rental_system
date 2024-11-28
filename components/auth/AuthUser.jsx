// components/auth/AuthUser.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const AuthUser = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  // Function to set cookie for authenticated user
  const setAuthCookie = (uID) => {
    document.cookie = `auth=${uID}; path=/; max-age=3600`; // Sets cookie for 1 hour
    document.cookie = `afterLogin=True; path=/; max-age=3600`;
  };

  // Handle login on form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    const parsedPhoneNum = parseInt(phoneNumber);
    const hashedPassword = password;

    try {
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: parsedPhoneNum,
          password: hashedPassword,
        }),
      });

      if (!loginResponse.ok) {
        const loginData = await loginResponse.json();
        throw new Error(loginData.error || "Login failed. Please try again.");
      }

      const loginData = await loginResponse.json();

      // If login is successful, set the 'auth' cookie and redirect
      if (loginData.uID) {
        setAuthCookie(loginData.uID); // Set auth cookie
        router.push("/"); // Redirect to home page
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>Login</h1>
      {error && (
        <Alert
          severity="error"
          style={{
            marginBottom: "20px",
            width: "70%",
            textAlign: "left",
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "60%",
        }}
      >
        <TextField
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          label="Phone Number"
          variant="standard"
        />
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          variant="standard"
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </form>
    </div>
  );
};

export default AuthUser;
