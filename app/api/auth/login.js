// /pages/api/auth/login.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function findUserByPhoneNumber(phoneNumber) {
  return await prisma.user.findUnique({
    where: { uPhone_Num: phoneNumber },
  });
}

async function verifyPassword(inputPassword, storedPassword) {
  return bcrypt.compare(inputPassword, storedPassword);
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { phoneNumber, password } = req.body;

    try {
      const user = await findUserByPhoneNumber(phoneNumber);

      if (!user) {
        return res.status(401).json({ error: "Phone number not found" });
      }

      const isPasswordCorrect = await verifyPassword(password, user.uPassword);

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // If login is successful, return the uID
      return res.json({ uID: user.uID });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  res.status(405).end(); // Method Not Allowed
}
