"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";

const checkAuthCookie = () => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name.trim() === "auth") {
        return value;
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
    setLoading(false);

    if (authCookie) {
      setIsAuthenticated(true);

      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/register"
      ) {
        router.replace("/");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else {
      setIsAuthenticated(false);

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        router.replace("/login");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (
    !isAuthenticated &&
    (window.location.pathname === "/login" ||
      window.location.pathname === "/register")
  ) {
    return <Container>{children}</Container>;
  }

  return <Container>{isAuthenticated ? children : null}</Container>;
};

export default ProtectedRoute;
