import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const deliveries = await prisma.delivery.findMany();
    console.log("get deliveries:", deliveries);
    return NextResponse.json({ deliveries });
  } catch (error) {
    return NextResponse.json({ error: error.message });
    // return NextResponse.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
