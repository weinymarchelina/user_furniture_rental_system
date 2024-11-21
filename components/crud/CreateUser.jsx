import { useState } from "react";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing

const CreateUser = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    // e.preventDefault();

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phoneNumber: parseInt(phoneNumber),
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        console.log("User registered successfully", data);
      }

      return data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className="error-message">Error: {errorMessage}</div>
      ) : null}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create User</button>
      </form>
    </>
  );
};

export default CreateUser;
