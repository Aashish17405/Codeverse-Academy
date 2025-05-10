import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(req: NextRequest) {
  try {
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
