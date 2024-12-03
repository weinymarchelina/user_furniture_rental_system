import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCookie = (name, cookies) => {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
};

export async function GET(request) {
  try {
    const cookies = request.headers.get("cookie");
    const userID = getCookie("auth", cookies);

    console.log(userID);

    if (!userID) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const deliveries = await prisma.delivery.findMany({
      where: {
        uID: userID,
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
