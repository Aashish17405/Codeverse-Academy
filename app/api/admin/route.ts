import prisma from "@/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
  const users = await prisma.adminUser.findMany();
  console.log(users);
  return new Response(JSON.stringify(users));
}
