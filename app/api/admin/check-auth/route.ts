import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    // Get the auth cookie
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader
      ?.split(";")
      .find((c) => c.trim().startsWith("adminAuth="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      // Return success if token is valid
      return NextResponse.json(
        {
          authenticated: true,
          user: decoded,
        },
        { status: 200 }
      );
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 }
    );
  }
}
