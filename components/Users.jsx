"use client";

import { useState } from "react";
import { useEffect } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch("/api/users/get");

      if (!response.ok) {
        throw new Error("Failed to fetch users! Status: " + response.status);
      }

      const data = await response.json();
      console.log(data.users);
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users.length > 0 &&
        users.map((user) => (
          <div key={user.uId}>
            <h3>{user.uName}</h3>
            <p>{user.uPhone_Num}</p>
          </div>
        ))}
    </div>
  );
};

export default Users;
