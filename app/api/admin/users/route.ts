import { NextResponse } from "next/server";
import prisma from "@/prisma";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

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
