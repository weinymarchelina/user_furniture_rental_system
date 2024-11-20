// components/ui/GetCurrentUser.js
"use client";
import { useState, useEffect } from "react";
import SignOutButton from "../ui/SignOutButton";

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
    getUserInfo();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Info</h2>
      <p>Name: {user.uName}</p>
      <p>Phone Number: {user.uPhone_Num}</p>
      <SignOutButton />
    </div>
  );
};

export default GetCurrentUser;
