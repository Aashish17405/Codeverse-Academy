import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import checkAdminAuth from "@/lib/adminAuth";

// Validation schema for session creation
const sessionSchema = z.object({
  date: z.string(), // No transformation, allow as-is
  capacity: z.number().int().positive().default(30),
  courseName: z.string(),
});

const updateSchema = z.object({
  id: z.string(),
  date: z.string(),
  capacity: z.number().int().positive().default(30),
});

export async function POST(req: NextRequest) {
  try {
    const auth = checkAdminAuth(req);
if (!auth.authorized) return auth.response;


    const body = await req.json();

    // Validate request body
    const validation = sessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { date, capacity, courseName } = validation.data;

    const normalizedDate = new Date(date);
    normalizedDate.setHours(18, 0, 0, 0); // Set time to 6 PM

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
    const auth = checkAdminAuth(req);
if (!auth.authorized) return auth.response;


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

export async function PUT(req: NextRequest) {
  try {
    const auth = checkAdminAuth(req);
if (!auth.authorized) return auth.response;


    const body = await req.json();

    // Validate request body
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { id, date, capacity } = validation.data;

    // Normalize the date
    const normalizedDate = new Date(date);
    normalizedDate.setHours(18, 0, 0, 0);

    // Check if the session exists
    const existingSession = await prisma.demoSession.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update the session
    const updatedSession = await prisma.demoSession.update({
      where: { id },
      data: {
        date: normalizedDate,
        capacity,
      },
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
    });

    // Transform the response to include ticket count
    const transformedSession = {
      ...updatedSession,
      ticketCount: updatedSession._count.tickets,
      _count: undefined,
    };

    return NextResponse.json({
      message: "Demo session updated successfully",
      session: transformedSession,
    });
  } catch (error) {
    console.error("Error updating demo session:", error);
    return NextResponse.json(
      { error: "Failed to update demo session" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    // Verify admin authentication
    const auth = checkAdminAuth(req);
if (!auth.authorized) return auth.response;


    // Get the session ID from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Check if the session exists
    const existingSession = await prisma.demoSession.findUnique({
      where: { id },
      include: {
        tickets: true,
      },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Delete the session
    await prisma.demoSession.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Demo session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting demo session:", error);
    return NextResponse.json(
      { error: "Failed to delete demo session" },
      { status: 500 }
    );
  }
};