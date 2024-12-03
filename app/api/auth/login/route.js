import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function findUserByPhoneNumber(phoneNumber) {
  return await prisma.user.findUnique({
    where: { uPhone_Num: phoneNumber },
  });
}

async function verifyPassword(inputPassword, storedPassword) {
  console.log("Input password:", inputPassword);
  console.log("Stored password hash:", storedPassword);
  return bcrypt.compare(inputPassword, storedPassword);
}

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

    console.log("User stored hash:", user.uPassword);
    const isPasswordCorrect = await verifyPassword(password, user.uPassword);
    console.log("Password match result:", isPasswordCorrect);

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
