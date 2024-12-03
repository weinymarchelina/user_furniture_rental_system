import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { pID, orderAmount } = await req.json();
    console.log("Incoming data:", { pID, orderAmount });

    if (!pID || !orderAmount || orderAmount < 1) {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { pID: pID },
    });

    console.log("Found product:", product);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    if (product.gNum < orderAmount) {
      return NextResponse.json(
        { error: "Not enough stock available." },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { pID: pID },
      data: {
        gNum: product.gNum - orderAmount,
        updated_at: new Date(),
      },
    });

    console.log("Updated product:", updatedProduct);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
