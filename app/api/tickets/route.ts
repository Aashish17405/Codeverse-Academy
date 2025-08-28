import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
// Removed email imports as we'll handle that in a separate endpoint

const ticketSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  sessionId: z.string().uuid(),
  // Removed imageUrl requirement as it will be added later
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const validation = ticketSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, name, sessionId } = validation.data;

    const session = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: { tickets: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.tickets.length >= session.capacity) {
      return NextResponse.json(
        { error: "Session is at full capacity" },
        { status: 400 }
      );
    }

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
    const tickets = await prisma.ticket.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        session: {
          select: {
            date: true,
          },
        },
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
