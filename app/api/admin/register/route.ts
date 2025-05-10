import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';
import jwt from "jsonwebtoken";

const adminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    
    const validation = adminSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, password } = validation.data;
    
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    });
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 409 }
      );
    }
    
    const passwordHash = await hashPassword(password);
    
    const admin = await prisma.adminUser.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
    
    const { passwordHash: _, ...adminData } = admin;
    
    return NextResponse.json(
      { 
        message: 'Admin user created successfully',
        admin: adminData
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}