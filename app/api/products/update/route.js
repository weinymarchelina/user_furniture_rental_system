import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    // Log the incoming request body to ensure it's being parsed correctly
    const { pID, orderAmount } = await req.json();
    console.log("Incoming data:", { pID, orderAmount });

    // Validate the input data
    if (!pID || !orderAmount || orderAmount < 1) {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    // Find the product by pID
    const product = await prisma.product.findUnique({
      where: { pID: pID },
    });

    // Log the product if found or if not found
    console.log("Found product:", product);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // Check if enough stock is available
    if (product.gNum < orderAmount) {
      return NextResponse.json(
        { error: "Not enough stock available." },
        { status: 400 }
      );
    }

    // Update the stock after the order
    const updatedProduct = await prisma.product.update({
      where: { pID: pID },
      data: {
        gNum: product.gNum - orderAmount, // Decrease the stock by orderAmount
        updated_at: new Date(), // Update the timestamp
      },
    });

    // Log updated product details
    console.log("Updated product:", updatedProduct);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    // Log the full error for debugging
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
