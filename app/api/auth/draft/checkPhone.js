// /app/api/auth/checkPhone.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findUserByPhoneNumber(phoneNumber) {
  console.log(phoneNumber);
  return await prisma.user.findUnique({
    where: { uPhone_Num: phoneNumber },
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { phoneNumber } = req.body;
    console.log("Received phoneNumber:", phoneNumber);

    try {
      const user = await findUserByPhoneNumber(phoneNumber);
      console.log("Found user:", user);

      if (user) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error("Error during DB query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  res.status(405).end();
}
