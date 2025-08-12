import checkAdminAuth from "@/lib/adminAuth";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response;

  
  const users = await prisma.adminUser.findMany();
  console.log(users);
  return new Response(JSON.stringify(users));
}
