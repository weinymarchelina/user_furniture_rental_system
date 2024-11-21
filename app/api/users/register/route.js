import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();

  if (!body.name || !body.phoneNumber || !body.password) {
    return NextResponse.json({
      error: "Missing required fields",
      status: 400, // Changed to 400 for proper HTTP status
    });
  }

  console.log(body.name, body.phoneNumber);

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create a new user with the hashed password
    const user = await prisma.user.create({
      data: {
        uName: body.name,
        uPhone_Num: body.phoneNumber,
        uPassword: hashedPassword, // Store the hashed password
      },
    });

    console.log("New user created: ", user);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          uName: user.uName,
          uPhone_Num: user.uPhone_Num,
        },
      },
      { status: 201 } // Use 201 for resource creation
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" // Unique constraint violation
    ) {
      if (
        error.meta &&
        error.meta.target &&
        error.meta.target.includes("uPhone_Num")
      ) {
        return NextResponse.json(
          {
            error:
              "Phone number is already registered. Please use a different phone number.",
          },
          { status: 400 }
        );
      }
    }

    console.error("Error creating user: ", error);
    return NextResponse.json(
      {
        error: "An error occurred while creating the user",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
