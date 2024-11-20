// /pages/api/auth/checkPhone.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findUserByPhoneNumber(phoneNumber) {
  return await prisma.user.findUnique({
    where: { uPhone_Num: phoneNumber },
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { phoneNumber } = req.body;

    try {
      const user = await findUserByPhoneNumber(phoneNumber);

      if (user) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  res.status(405).end(); // Method Not Allowed
}
