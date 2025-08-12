import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function checkAdminAuth(
  req: NextRequest
):
  | { authorized: true; admin: { id: string } }
  | { authorized: false; response: NextResponse } {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split(";")
    .find((c) => c.trim().startsWith("adminAuth="))
    ?.split("=")[1];

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      ),
    };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // If payload is a string, it's invalid for our use case
    if (typeof payload !== "object" || !payload.id) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Unauthorized: Invalid token payload" },
          { status: 403 }
        ),
      };
    }
    return { authorized: true, admin: { id: payload.id } };
  } catch (err) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 403 }
      ),
    };
  }
}
