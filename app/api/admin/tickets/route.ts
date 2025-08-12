import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendEmail, generateTicketEmailTemplate } from "@/lib/email";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import checkAdminAuth from "@/lib/adminAuth";

const adminTicketSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  phone: z.string().min(10).optional(),
  // sessionId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const validation = adminTicketSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    // const { email, name, sessionId } = validation.data;
    const { email, name } = validation.data;
    const sessionId = "b0a89775-56f3-43f3-8550-1f7242b10942"

    const session = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: { tickets: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // if (session.tickets.length >= session.capacity) {
    //   return NextResponse.json(
    //     { error: "Session is at full capacity" },
    //     { status: 400 }
    //   );
    // }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    // Create ticket without image URL initially
    const ticket = await prisma.ticket.create({
      data: {
        status: "CREATED",
        userId: user.id,
        sessionId,
        qrCodeUrl: "", // Add empty qrCodeUrl as it's required by the schema
      },
    });

    const course = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      select: {
        courseName: true,
      },
    });

    return NextResponse.json(
      {
        message: "Ticket created successfully",
        ticket: {
          id: ticket.id,
          status: ticket.status,
          sessionDate: session.date,
          courseName: course?.courseName || "Demo Session",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const auth = checkAdminAuth(req);
    if (!auth.authorized) return auth.response;

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const sessionId = searchParams.get("sessionId");

    // Build filter conditions
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (sessionId) {
      where.sessionId = sessionId;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        session: {
          select: {
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
