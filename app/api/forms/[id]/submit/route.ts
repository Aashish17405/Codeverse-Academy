import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendFormEmail } from "@/lib/formEmail";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const formId = params.id;
    const body = await request.json();
    const { responses } = body;

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: "Invalid response data" },
        { status: 400 }
      );
    }

    // Verify the form exists and is active
    const form = await prisma.form.findFirst({
      where: { id: formId, isActive: true },
      include: { fields: true },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found or inactive" },
        { status: 404 }
      );
    }

    // Create the form response
    const formResponse = await prisma.formResponse.create({
      data: {
        formId,
        fieldResponses: {
          create: responses.map((response: any) => ({
            formFieldId: response.fieldId,
            value: response.value,
          })),
        },
      },
      include: {
        fieldResponses: {
          include: {
            formField: true,
          },
        },
      },
    });

    // Send email to user if enabled on form
    if (form.sendEmailOnSubmit && form.emailSubject && form.emailContent) {
      console.log("[FormEmail] sendEmailOnSubmit is enabled");
      // Find the email field in the form fields
      const emailField = form.fields.find((f: any) => f.type === "EMAIL");
      if (!emailField) {
        console.log("[FormEmail] No EMAIL field found in form.fields");
      }
      if (emailField) {
        // Find the submitted value for the email field
        const emailResponse = formResponse.fieldResponses.find(
          (fr: any) => fr.formFieldId === emailField.id
        );
        const userEmail = emailResponse?.value;
        console.log("[FormEmail] Extracted userEmail:", userEmail);
        if (userEmail) {
          const sendResult = await sendFormEmail({
            to: userEmail,
            subject: form.emailSubject,
            html: form.emailContent,
          });
          console.log("[FormEmail] sendFormEmail result:", sendResult);
        } else {
          console.log("[FormEmail] No userEmail found in fieldResponses");
        }
      }
    } else {
      console.log(
        "[FormEmail] sendEmailOnSubmit not enabled or missing subject/content",
        {
          sendEmailOnSubmit: form.sendEmailOnSubmit,
          emailSubject: form.emailSubject,
          emailContent: form.emailContent,
        }
      );
    }

    return NextResponse.json({
      message: "Form submitted successfully",
      responseId: formResponse.id,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
