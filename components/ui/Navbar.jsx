"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for the 'auth' cookie
    const authCookie = Cookies.get("auth");
    setIsAuthenticated(!!authCookie); // Set true if the cookie exists
  }, []);

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
