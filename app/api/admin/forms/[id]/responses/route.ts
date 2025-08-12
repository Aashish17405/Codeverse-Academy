import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import checkAdminAuth from "@/lib/adminAuth";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const auth = checkAdminAuth(request);
    if (!auth.authorized) return auth.response;

    const params = await context.params;
    const formId = params.id;

    const form = await prisma.form.findFirst({
      where: { id: formId, createdBy: auth.admin.id || "" },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const responses = await prisma.formResponse.findMany({
      where: { formId },
      include: {
        fieldResponses: {
          include: {
            formField: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
