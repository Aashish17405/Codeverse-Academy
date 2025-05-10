import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { sendEmail, generateTicketEmailTemplate } from "@/lib/email";
import { z } from "zod";

const ticketSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  sessionId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${user.id}`;

    const ticket = await prisma.ticket.create({
      data: {
        qrCodeUrl,
        status: "CREATED",
        userId: user.id,
        sessionId,
      },
    });

    const course = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      select: {
        courseName: true,
      },
    });

    const emailTemplate = generateTicketEmailTemplate(
      user.name,
      session.date,
      ticket.id,
      course?.courseName ?? "",
    );

    await sendEmail({
      to: user.email,
      subject: "Your Codeverse Demo Session Ticket",
      html: emailTemplate,
    });

    return NextResponse.json(
      {
        message: "Ticket created successfully",
        ticket: {
          id: ticket.id,
          status: ticket.status,
          qrCodeUrl: ticket.qrCodeUrl,
          sessionDate: session.date,
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
