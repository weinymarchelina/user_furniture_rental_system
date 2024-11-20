import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const placeholderDate = new Date("1970-01-01T00:00:00.000Z");
  const body = await request.json();

  if (
    !body.goodsId ||
    !body.rentalTime ||
    !body.orderAmount ||
    !body.destination ||
    !body.userId
  ) {
    return NextResponse.json({
      error: "Missing required fields",
      status: 200,
    });
  }

  console.log(body);

  try {
    const delivery = await prisma.delivery.create({
      data: {
        gID: body.goodsId,
        uID: body.userId,
        d_startDate: new Date(),
        d_arriveDate: placeholderDate,
        d_rentalTime: body.rentalTime,
        d_orderAmount: body.orderAmount,
        d_destination: body.destination,

        // d_startDate is omitted here to use the default value
      },
    });

    console.log("New delivery created: ", delivery);

    return NextResponse.json(delivery, {
      message: "Delivery created successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error creating delivery: ", error);

    return NextResponse.json({
      error: "An error occurred while creating the delivery",
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
