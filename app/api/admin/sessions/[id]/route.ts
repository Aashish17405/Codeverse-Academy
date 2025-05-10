import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';
import { z } from 'zod';
import jwt from "jsonwebtoken";

const updateSessionSchema = z.object({
  date: z.string().transform(str => new Date(str)).optional(),
  capacity: z.number().int().positive().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split(";").find(c => c.trim().startsWith("adminAuth="))?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
    }

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
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
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
    
    const validation = updateSessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const updateData = validation.data;
    
    const existingSession = await prisma.demoSession.findUnique({
      where: { id: sessionId },
    });
    
    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const updatedSession = await prisma.demoSession.update({
      where: { id: sessionId },
      data: updateData,
    });
    
    return NextResponse.json({
      message: 'Session updated successfully',
      session: updatedSession,
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
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
    
    const existingSession = await prisma.demoSession.findUnique({
      where: { id: sessionId },
      include: {
        tickets: true,
      },
    });
    
    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    if (existingSession.tickets.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete session with existing tickets' },
        { status: 400 }
      );
    }
    
    await prisma.demoSession.delete({
      where: { id: sessionId },
    });
    
    return NextResponse.json({
      message: 'Session deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}