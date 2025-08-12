import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const enquirySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  phoneNumber: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const validation = enquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, name, phoneNumber } = validation.data;

    const newEnquiry = await prisma.enquiry.create({
      data: {
        email,
        phoneNumber,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "PENDING",
      },
    });

    console.log("New enquiry created:", newEnquiry);

    return NextResponse.json(
      {
        message: "Enquiry added successfully",
        newEnquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error : Enquiry creation failed", error);
    return NextResponse.json(
      { error: "Failed to add enquiry" },
      { status: 500 }
    );
  }
}