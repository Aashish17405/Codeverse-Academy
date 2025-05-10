import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";

const sessionSchema = z.object({
  date: z.string(), 
  capacity: z.number().int().positive().default(30),
  courseName: z.string(),
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

    const validation = sessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { date, capacity, courseName } = validation.data;

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    const session = await prisma.demoSession.create({
      data: {
        date: normalizedDate,
        capacity,
        courseName,
      },
    });

    return NextResponse.json(
      {
        message: "Demo session created successfully",
        session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating demo session:", error);
    return NextResponse.json(
      { error: "Failed to create demo session" },
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

    const sessions = await prisma.demoSession.findMany({
      include: {
        _count: {
          select: { tickets: true },
        },
        tickets: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const transformedSessions = sessions.map((session) => ({
      ...session,
      ticketCount: session._count.tickets,
      _count: undefined,
    }));

    return NextResponse.json(transformedSessions);
  } catch (error) {
    console.error("Error fetching demo sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch demo sessions", sessions: [] },
      { status: 500 }
    );
  }
}
