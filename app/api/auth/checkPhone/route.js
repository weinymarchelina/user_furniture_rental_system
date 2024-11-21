import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to find a user by phone number
async function findUserByPhoneNumber(phoneNumber) {
  console.log(phoneNumber);
  return await prisma.user.findUnique({
    where: { uPhone_Num: phoneNumber },
  });
}

// Handle POST request
export async function POST(req) {
  try {
    // Parse the request body
    const { phoneNumber } = await req.json();
    console.log("Received phoneNumber:", phoneNumber);

    // Query the database
    const user = await findUserByPhoneNumber(phoneNumber);
    console.log("Found user:", user);

    // Return response
    if (user) {
      return new Response(JSON.stringify({ exists: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error during DB query:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
