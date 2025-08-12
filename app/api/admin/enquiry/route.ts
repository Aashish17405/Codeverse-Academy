import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const enquiryUpdateSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);
    const validation = enquiryUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }
    const { id, status } = validation.data;
    const udpatedEnquiry = await prisma.enquiry.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        updatedAt: new Date(),
      },
    });
    console.log("Enquiry updated:", udpatedEnquiry);
    return NextResponse.json(udpatedEnquiry);
  } catch (e) {
    console.error("Error : Enquiry updation failed", e);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany();
    // console.log("Fetched enquiries:", enquiries);

    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}