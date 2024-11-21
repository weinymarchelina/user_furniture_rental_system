"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  // Hash the password before storing it
  const saltRounds = 10;

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
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

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

      // Step 3: If login is successful, set the 'auth' cookie and redirect
      if (loginData.uID) {
        setAuthCookie(loginData.uID); // Set auth cookie
        router.push("/"); // Redirect to home page
      }
    } catch (error) {
      setError(error.message);
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
