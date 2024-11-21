"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

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
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        background: "#f5f5f5",
      }}
    >
      {isAuthenticated ? (
        <>
          <Link href="/">Home</Link>
          <Link href="/product">Products</Link>
          <Link href="/delivery">Deliveries</Link>
        </>
      ) : (
        <>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
