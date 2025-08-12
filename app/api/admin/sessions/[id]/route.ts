import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import checkAdminAuth from "@/lib/adminAuth";

const updateSessionSchema = z.object({
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  capacity: z.number().int().positive().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = checkAdminAuth(req);
    if (!auth.authorized) return auth.response;

    const sessionId = params.id;

    const session = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: {
        tickets: {
          include: {
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

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await req.json();

    // Validate request body
    const validation = updateSessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    // Check if session exists
    const existingSession = await prisma.demoSession.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update session
    const updatedSession = await prisma.demoSession.update({
      where: { id: sessionId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    // Check if session exists
    const existingSession = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: {
        tickets: true,
      },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if session has tickets
    if (existingSession.tickets.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete session with existing tickets" },
        { status: 400 }
      );
    }

    // Delete session
    await prisma.demoSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
