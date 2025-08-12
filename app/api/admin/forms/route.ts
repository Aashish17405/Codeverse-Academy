import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import checkAdminAuth from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const auth = checkAdminAuth(request);
    if (!auth.authorized) return auth.response;

    const forms = await prisma.form.findMany({
      where: { createdBy: auth.admin.id || "" },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = checkAdminAuth(request);
    if (!auth.authorized) return auth.response;
    const adminId = auth.admin.id;

    const body = await request.json();
    const {
      title,
      description,
      fields,
      sendEmailOnSubmit,
      emailSubject,
      emailContent,
    } = body;

    if (!title || !fields || !Array.isArray(fields)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const form = await prisma.form.create({
      data: {
        title,
        description,
        createdBy: adminId,
        sendEmailOnSubmit: !!sendEmailOnSubmit,
        emailSubject: sendEmailOnSubmit ? emailSubject : null,
        emailContent: sendEmailOnSubmit ? emailContent : null,
        fields: {
          create: fields.map((field: any, index: number) => ({
            label: field.label,
            type: field.type,
            required: field.required || false,
            order: index,
            options: field.options || [],
          })),
        },
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
