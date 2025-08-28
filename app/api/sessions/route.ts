import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface session {
  id: string;
  date: Date;
  courseName: string;
  capacity: number;
  _count: {
    tickets: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    console.log("Current date/time:", now);

    const sessions = await prisma.demoSession.findMany({
      where: {
        date: {
          gte: now, // Only fetch sessions that are in the future
        },
      },
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

    console.log("Found future sessions:", sessions.length);
    sessions.forEach((session) => {
      console.log(`Session: ${session.courseName} on ${session.date}`);
    });

    const transformedSessions = sessions.map((session: session) => ({
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
