import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  generateInternshipConfirmationEmail,
  sendEmail,
} from "@/lib/internshipFormEmail";

const formSchema = z.object({
  name: z.string().min(2),
  collegeName: z.string().min(2),
  interestedInternship: z.enum(["AI", "WEB_DEV"]),
  collegeEmail: z.string().min(2),
  phoneNumber: z.string().min(10),
  whatsappNumber: z.string().min(10),
  homeLocation: z.string().min(2),
  currentLocation: z.string().min(2),
  attendOffline: z.boolean(),
  certificationMode: z.enum(["online", "offline"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = formSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }
    const data = validation.data;
    const record = await prisma.internshipEnrollments.create({
      data: {
        name: data.name,
        collegeName: data.collegeName,
        interestedInternship: data.interestedInternship,
        collegeEmail: data.collegeEmail,
        phoneNumber: data.phoneNumber,
        whatsappNumber: data.whatsappNumber,
        homeLocation: data.homeLocation,
        currentLocation: data.currentLocation,
        attendOffline: data.attendOffline ? "yes" : "no",
        certificationMode: data.certificationMode,
      },
    });

    try {
      const emailHtml = generateInternshipConfirmationEmail(data);
      await sendEmail({
        to: data.collegeEmail,
        subject: "AstraTech Internship Registration Confirmation",
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't block the response for email failure, but log it.
    }

    return NextResponse.json(
      { message: "Enrollment successful", record },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internship enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to submit enrollment" },
      { status: 500 }
    );
  }
}
