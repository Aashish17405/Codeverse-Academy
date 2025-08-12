import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  generatePaymentConfirmationEmail,
  sendEmail,
} from "@/lib/paymentEmail";

export async function GET() {
  try {
    const enrollments = await prisma.internshipEnrollments.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ enrollments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

const patchSchema = z.object({
  id: z.string(),
  paymentStatus: z.enum(["PAID", "UNPAID"]),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }
    const { id, paymentStatus } = validation.data;
    const updated = await prisma.internshipEnrollments.update({
      where: { id },
      data: { internshipPaymentStatus: paymentStatus },
    });
    if (
      updated.internshipPaymentStatus === "PAID" &&
      updated.name &&
      updated.collegeEmail &&
      updated.interestedInternship
    ) {
      try {
        const emailHtml = generatePaymentConfirmationEmail({
          name: updated.name,
          collegeEmail: updated.collegeEmail,
          interestedInternship: updated.interestedInternship,
        });
        await sendEmail({
          to: updated.collegeEmail,
          subject: "AstraTech Internship Payment Confirmation",
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Failed to send payment confirmation email:", emailError);
      }
    }
    return NextResponse.json({ updated }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
