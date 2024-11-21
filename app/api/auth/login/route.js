import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Using bcryptjs for consistency

const prisma = new PrismaClient();

// Function to find a user by phone number
async function findUserByPhoneNumber(phoneNumber) {
  return await prisma.user.findUnique({
    where: { uPhone_Num: phoneNumber },
  });
}

// Function to verify the password (bcrypt comparison)

async function verifyPassword(inputPassword, storedPassword) {
  console.log("Input password:", inputPassword); // Debugging
  console.log("Stored password hash:", storedPassword); // Debugging
  return bcrypt.compare(inputPassword, storedPassword); // bcrypt compares input with the hash
}

/*
async function verifyPassword(inputPassword, storedPassword) {
  return inputPassword === storedPassword; // bcrypt compares input with the hash
}
*/

// Named export for handling POST request
export async function POST(req) {
  const { phoneNumber, password } = await req.json();
  console.log(
    "Received phoneNumber:",
    phoneNumber,
    "Received password:",
    password
  );

  try {
    const user = await findUserByPhoneNumber(phoneNumber);
    if (!user) {
      return new Response(JSON.stringify({ error: "Phone number not found" }), {
        status: 401,
      });
    }

    // Debugging stored password hash
    console.log("User stored hash:", user.uPassword);
    const isPasswordCorrect = await verifyPassword(password, user.uPassword);
    console.log("Password match result:", isPasswordCorrect); // Debugging result of password comparison

    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ error: "Incorrect password" }), {
        status: 401,
      });
    }

    return new Response(JSON.stringify({ uID: user.uID }), { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
