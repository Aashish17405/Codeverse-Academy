import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import checkAdminAuth from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = checkAdminAuth(req);
    if (!auth.authorized) return auth.response;

    const users = await prisma.user.findMany({
      include: {
        tickets: {
          include: {
            session: {
              select: {
                id: true,
                date: true,
                courseName: true,
              },
            },
          },
        },
      },
    });

    const formatted = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      courses: user.tickets.map((ticket) => ({
        ticketId: ticket.id,
        status: ticket.status,
        courseName: ticket.session.courseName,
        sessionDate: ticket.session.date,
      })),
    }));

    return NextResponse.json({ users: formatted });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
