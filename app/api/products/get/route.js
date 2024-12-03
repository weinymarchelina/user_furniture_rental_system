import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    console.log("get products:", products);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
