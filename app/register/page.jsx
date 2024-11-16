"use client";

import Image from "next/image";
import CreateUser from "../../components/CreateUser";
import Users from "../../components/Users";

export default function Register() {
  return (
    <div>
      <h1>Register User</h1>

      <CreateUser />
      <Users />
    </div>
  );
}
