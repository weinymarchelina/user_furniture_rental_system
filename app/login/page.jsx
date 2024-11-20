"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  // Function to set cookie for authenticated user
  const setAuthCookie = (uID) => {
    document.cookie = `auth=${uID}; path=/; max-age=3600`; // Sets cookie for 1 hour
  };

  // Handle login on form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Step 1: Check if phone number exists
    const phoneResponse = await fetch("/api/auth/checkPhone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const phoneData = await phoneResponse.json();
    if (!phoneResponse.ok || !phoneData.exists) {
      setError("Phone number not found.");
      return;
    }

    // Step 2: Verify password
    const loginResponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, password }),
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      setError(loginData.error || "Login failed. Please try again.");
      return;
    }

    // Step 3: If login is successful, set the 'auth' cookie and redirect
    if (loginData.uID) {
      setAuthCookie(loginData.uID); // Set auth cookie
      router.push("/"); // Redirect to home page
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
