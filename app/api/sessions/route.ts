import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const sessions = await prisma.demoSession.findMany({
      select: {
        id: true,
        date: true,
        courseName: true,
        capacity: true,
        _count: {
          select: {
            tickets: true,
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
