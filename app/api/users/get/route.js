import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    console.log("get users:", users);
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error.message });
    // return NextResponse.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
