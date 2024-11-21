import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Helper function to get cookies from the request headers
const getCookie = (name, cookies) => {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
};

export async function GET(request) {
  try {
    // Extract the 'auth' cookie from the request headers to get the user ID
    const cookies = request.headers.get("cookie");
    const userID = getCookie("auth", cookies);

    console.log(userID);

    if (!userID) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Fetch deliveries for the authenticated user (by uID)
    const deliveries = await prisma.delivery.findMany({
      where: {
        uID: userID, // Filter deliveries based on userID
      },
    });

    console.log("get deliveries for user:", userID, deliveries);
    return NextResponse.json({ deliveries });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
