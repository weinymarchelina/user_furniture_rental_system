"use client"; // Mark the component as a client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Helper function to check if the auth cookie exists
const checkAuthCookie = () => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name.trim() === "auth") {
        return value; // return the auth cookie value (e.g., user ID or token)
      }
    }
  }
  return null;
};

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authCookie = checkAuthCookie();
    setLoading(false); // Stop loading once the cookie check is done

    if (authCookie) {
      setIsAuthenticated(true);
      // If the user is authenticated and tries to access /login or /register, redirect them
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/register"
      ) {
        router.replace("/"); // Use replace() to ensure a fresh navigation (won't add to history)
        setTimeout(() => {
          window.location.reload(); // Wait 1 second and then force a full page reload
        }, 1000);
      }
    } else {
      setIsAuthenticated(false);
      // If the user is not authenticated, allow them to visit login or register
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        router.replace("/login"); // Use replace() to redirect to login and refresh the page
        setTimeout(() => {
          window.location.reload(); // Wait 1 second and then force a full page reload
        }, 500);
      }
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading until cookie check is done
  }

  // Allow /login and /register routes to render even when not authenticated
  if (
    !isAuthenticated &&
    (window.location.pathname === "/login" ||
      window.location.pathname === "/register")
  ) {
    return <>{children}</>;
  }

  // Render the children if authenticated
  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
