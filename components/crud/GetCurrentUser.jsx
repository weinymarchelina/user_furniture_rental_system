"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
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

  // Check if the cookie exists on component mount and remove it
  useEffect(() => {
    const afterLoginCookie = Cookies.get("afterLogin");

    if (afterLoginCookie) {
      // Remove the cookie after login
      Cookies.remove("afterLogin");

      // Refresh the page after removing the cookie
      window.location.reload(); // This will refresh the page
    } else {
      // If no cookie, fetch the user info
      getUserInfo();
    }
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
