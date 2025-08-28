import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import checkAdminAuth from "@/lib/adminAuth";

const updateTicketSchema = z.object({
  status: z.enum([
    "CREATED",
    "ATTENDED",
    "NOT_ATTENDED",
    "CANCELLED",
    "SUBSCRIBED",
  ]),
});

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const auth = checkAdminAuth(req);
    if (!auth.authorized) return auth.response;

    const { id: ticketId } = await context.params;
    console.log(ticketId);

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        session: {
          select: {
            date: true,
            capacity: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    console.log("Fetched ticket:", ticket);

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const auth = checkAdminAuth(req);
    if (!auth.authorized) return auth.response;

    const { id: ticketId } = await context.params;
    const body = await req.json();

    // Validate request body
    const validation = updateTicketSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: true,
        session: true,
      },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
      include: {
        user: true,
        session: true,
      },
    });

    console.log("Updated ticket:", updatedTicket);

    return NextResponse.json({
      message: "Ticket status updated successfully",
      ticket: {
        id: updatedTicket.id,
        status: updatedTicket.status,
        user: {
          name: updatedTicket.user.name,
          email: updatedTicket.user.email,
        },
        session: {
          date: updatedTicket.session.date,
        },
      },
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: ticketId } = await context.params;

    // Check if ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: true,
      },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Delete ticket
    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    // Optionally send email notification
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(to right, #00b4d8, #0077b6);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AstraTech Ticket Cancelled</h1>
        </div>
        <div class="content">
          <p>Hello ${existingTicket.user.name},</p>
          <p>Your ticket (ID: ${existingTicket.id}) has been cancelled.</p>
          <p>If you believe this is an error or would like to book another session, please visit our website or contact us at support@astratech.edu</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AstraTech. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: existingTicket.user.email,
      subject: "AstraTech Ticket Cancelled",
      html: emailHtml,
    });

    return NextResponse.json({
      message: "Ticket deleted successfully",
      emailSent: true,
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
