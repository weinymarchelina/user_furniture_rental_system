"use client";

const SignOutButton = () => {
  const handleSignOut = () => {
    // Delete the 'auth' cookie
    document.cookie = "auth=; Max-Age=0; path=/"; // This will delete the cookie
    window.location.href = "/"; // Redirect to home page
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
