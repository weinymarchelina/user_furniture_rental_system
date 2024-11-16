import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();

  if (!body.name || !body.phoneNumber || !body.password) {
    return NextResponse.json({
      error: "Missing required fields",
      status: 200,
    });
  }

  console.log(body.name, body.phoneNumber, body.password);

  try {
    const user = await prisma.user.create({
      data: {
        uName: body.name,
        uPhone_Num: body.phoneNumber,
        uPassword: body.password,
      },
    });

    console.log("New user created: ", user);

    return NextResponse.json(user, {
      message: "User created successfully",
      status: 200,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" // Code for unique constraint violation
    ) {
      // Check the field causing the error
      if (
        error.meta &&
        error.meta.target &&
        error.meta.target.includes("uPhone_Num")
      ) {
        return NextResponse.json({
          error:
            "Phone number is already registered. Please use a different phone number.",
          status: 400,
        });
      }
    }

    console.error("Error creating user: ", error);
    return NextResponse.json({
      error: "An error occurred while creating the user",
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}