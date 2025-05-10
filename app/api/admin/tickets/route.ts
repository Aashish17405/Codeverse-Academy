import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { z } from "zod";
import { sendEmail, generateTicketEmailTemplate } from "@/lib/email";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";

const adminTicketSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().min(10).optional(),
  sessionId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader
      ?.split(";")
      .find((c) => c.trim().startsWith("adminAuth="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const validation = adminTicketSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, name, phone, sessionId } = validation.data;

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
          phoneNumber: phone || null,
        },
      });
    } else if (phone && !user.phoneNumber) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { phoneNumber: phone },
      });
    }

    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${user.id}`;

    const qrCodeBase64 = await QRCode.toDataURL(qrCodeUrl);

    const ticket = await prisma.ticket.create({
      data: {
        qrCodeUrl,
        status: "CREATED",
        userId: user.id,
        sessionId,
      },
      include: {
        user: true,
        session: true,
      },
    });

    const course = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      select: {
        courseName: true,
      },
    });

    console.log(course?.courseName);

    const emailTemplate = generateTicketEmailTemplate(
      user.name,
      session.date,
      ticket.id,
      course?.courseName ?? ""
    );

    await sendEmail({
      to: user.email,
      subject: "Your Codeverse Demo Session Ticket",
      html: emailTemplate,
    });

    return NextResponse.json(
      {
        message: "Ticket created successfully by admin",
        ticket: {
          id: ticket.id,
          status: ticket.status,
          qrCodeUrl: ticket.qrCodeUrl,
          user: {
            name: ticket.user.name,
            email: ticket.user.email,
            phoneNumber: ticket.user.phoneNumber,
          },
          session: {
            date: ticket.session.date,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ticket by admin:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader
      ?.split(";")
      .find((c) => c.trim().startsWith("adminAuth="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const sessionId = searchParams.get("sessionId");

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
