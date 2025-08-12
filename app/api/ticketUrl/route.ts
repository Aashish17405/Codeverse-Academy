import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail, generateTicketEmailTemplate } from "@/lib/email";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { Readable } from 'stream';

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      // Handle multipart form data
      const formData = await req.formData();
      
      // Extract form fields
      const userEmail = formData.get("userEmail") as string;
      const userName = formData.get("userName") as string;
      const sessionId = formData.get("sessionId") as string;
      const ticketId = formData.get("ticketId") as string || undefined;
      const courseName = formData.get("courseName") as string || "Demo Session";
      const ticketFile = formData.get("ticketImage") as File;
      
      // Validate required fields
      if (!userEmail || !userName || !sessionId || !ticketFile) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
      
      // Validate email format
      if (!userEmail.includes('@') || userEmail.length < 5) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
      
      // Validate name length
      if (userName.length < 2) {
        return NextResponse.json(
          { error: "Name must be at least 2 characters" },
          { status: 400 }
        );
      }
      
      // Upload the ticket image to Cloudinary
      let imageUrl;
      try {
        // Convert File to buffer for Cloudinary upload
        const arrayBuffer = await ticketFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Upload to Cloudinary using buffer
        const uploadResponse = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "tickets",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          // Create a readable stream from the buffer and pipe to Cloudinary
          const readableStream = new Readable();
          readableStream.push(buffer);
          readableStream.push(null);
          readableStream.pipe(uploadStream);
        });
        
        imageUrl = (uploadResponse as any).secure_url;
        console.log("Image uploaded to Cloudinary:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload ticket image" },
          { status: 500 }
        );
      }
      
      // Get session date
      const session = await prisma.demoSession.findUnique({
        where: { id: sessionId },
      });
      
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      
      // Generate and send email with ticket
      const emailTemplate = generateTicketEmailTemplate(
        userName,
        session.date,
        ticketId || "TICKET-" + Date.now(),
        courseName,
        imageUrl
      );
      
      const emailSent = await sendEmail({
        to: userEmail,
        subject: "Your AstraTech Demo Session Ticket",
        html: emailTemplate,
      });
      
      if (!emailSent) {
        return NextResponse.json(
          { error: "Failed to send ticket email" },
          { status: 500 }
        );
      }
      
      console.log("✅ Ticket sent successfully to", userEmail);
      
      return NextResponse.json(
        {
          message: "Ticket sent successfully",
          imageUrl,
          emailSent: true,
        },
        { status: 200 }
      );
    } else {
      // Fallback to JSON handling for backward compatibility
      const body = await req.json();
      console.log("Received ticket mailing request (JSON)");
      
      // Define schema for JSON requests
      const ticketMailingSchema = z.object({
        ticketUrl: z.string(), // Base64 encoded image or data URL
        email: z.string().email(),
        name: z.string().min(2),
        sessionId: z.string().uuid(),
        ticketId: z.string().optional(),
        courseName: z.string().optional().default("Demo Session"),
      });
      
      const validation = ticketMailingSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Invalid request data", details: validation.error.format() },
          { status: 400 }
        );
      }
      
      const {
        ticketUrl,
        email,
        name,
        sessionId,
        ticketId,
        courseName,
      } = validation.data;
      
      // Upload the ticket image to Cloudinary directly
      let imageUrl;
      try {
        // Upload base64 image directly to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(ticketUrl, {
          folder: "tickets",
        });
        imageUrl = uploadResponse.secure_url;
        console.log("Image uploaded to Cloudinary:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload ticket image" },
          { status: 500 }
        );
      }
      
      // Get session date
      const session = await prisma.demoSession.findUnique({
        where: { id: sessionId },
      });
      
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      
      // Generate and send email with ticket
      const emailTemplate = generateTicketEmailTemplate(
        name,
        session.date,
        ticketId || "TICKET-" + Date.now(),
        courseName,
        imageUrl
      );
      
      const emailSent = await sendEmail({
        to: email,
        subject: "Your AstraTech Demo Session Ticket",
        html: emailTemplate,
      });
      
      if (!emailSent) {
        return NextResponse.json(
          { error: "Failed to send ticket email" },
          { status: 500 }
        );
      }
      
      console.log("✅ Ticket sent successfully to", email);
      
      return NextResponse.json(
        {
          message: "Ticket sent successfully",
          imageUrl,
          emailSent: true,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("❌ Error sending ticket:", error);
    return NextResponse.json(
      { error: "Failed to process ticket" },
      { status: 500 }
    );
  }
}