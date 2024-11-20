"use client";

import Image from "next/image";
import CreateUser from "../../components/crud/CreateUser";
import Users from "../../components/crud/Users";

export default function Register() {
  return (
    <div>
      <h1>Register User</h1>

      <CreateUser />
      <Users />
    </div>
  );
}
