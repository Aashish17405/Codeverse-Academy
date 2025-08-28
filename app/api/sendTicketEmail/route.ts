import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail, generateTicketEmailTemplate } from "@/lib/email";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { generateAdminEmailTemplate } from "@/lib/adminEmail";

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received ticket email request");

    // Define schema for email requests
    const emailRequestSchema = z.object({
      ticketImage: z.string().nullable().optional(), // Allow null or undefined
      email: z.string().email(),
      name: z.string().min(2),
      phone: z.string().optional(), // Make phone optional since it's not always available
      sessionId: z.string().uuid(),
      ticketId: z.string(),
      courseName: z.string().optional().default("Demo Session"),
    });

    const validation = emailRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { ticketImage, email, name, sessionId, ticketId, courseName, phone } =
      validation.data;

    // Add logging to see what we received
    console.log("Request validation successful");
    console.log("Ticket image length:", ticketImage ? ticketImage.length : 0);
    console.log("Has ticket image:", !!ticketImage);
    console.log(
      "Image starts with data URL:",
      ticketImage ? ticketImage.startsWith("data:") : false
    );

    // First check if the ticket already has a valid image URL
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { qrCodeUrl: true },
    });

    // If the ticket already has a valid image URL, use it
    let imageUrl = "";
    if (existingTicket?.qrCodeUrl && existingTicket.qrCodeUrl !== "") {
      console.log(
        "Ticket already has an image URL, skipping upload:",
        existingTicket.qrCodeUrl
      );
      imageUrl = existingTicket.qrCodeUrl;
    } else if (ticketImage) {
      // Validate that ticketImage is a valid data URL
      if (!ticketImage.startsWith("data:image/")) {
        console.error("Invalid image format - not a data URL");
        imageUrl =
          "https://res.cloudinary.com/djlgmbop9/image/upload/q_100/logo_qrkfiv.jpg";
      } else {
        // Only upload if ticketImage is provided and valid
        // Upload the ticket image to Cloudinary with retry mechanism
        const maxRetries = 3;
        let retryCount = 0;
        let uploadSuccess = false;

        console.log("Valid image data URL detected, proceeding with upload...");

        while (retryCount < maxRetries && !uploadSuccess) {
          try {
            console.log(
              `Starting Cloudinary upload (attempt ${
                retryCount + 1
              } of ${maxRetries})...`
            );

            // Check if the image is too large and optimize if needed
            const isDataUrl = ticketImage.startsWith("data:");
            let optimizedImage = ticketImage;

            if (isDataUrl && ticketImage.length > 500000) {
              console.log("Image is large, optimizing before upload");
              // Just take the image as is, but in a real app you might want to resize/compress it
            }

            // Upload with timeout and optimization options
            const uploadResponse = await cloudinary.uploader.upload(
              optimizedImage,
              {
                folder: "tickets",
                timeout: 60000, // 1 minute timeout per attempt
                quality: 100, // Set quality to 100% for high quality images
                fetch_format: "auto", // Let Cloudinary choose the best format
                public_id: `ticket-${ticketId}-${name.replace(
                  /[^a-zA-Z0-9]/g,
                  "-"
                )}`, // Set a custom public ID with the ticket ID and name
                resource_type: "image",
                overwrite: true, // Overwrite if exists
              }
            );

            // Get the secure URL and ensure it has the q_100 parameter
            imageUrl = uploadResponse.secure_url;
            console.log(
              "✅ Image uploaded to Cloudinary successfully:",
              imageUrl
            );
            console.log("Upload response details:", {
              public_id: uploadResponse.public_id,
              secure_url: uploadResponse.secure_url,
              format: uploadResponse.format,
              bytes: uploadResponse.bytes,
            });
            uploadSuccess = true;

            // Break out of the loop since we've successfully uploaded the image
            break;
          } catch (uploadError) {
            retryCount++;
            console.error(
              `❌ Error uploading to Cloudinary (attempt ${retryCount} of ${maxRetries}):`,
              uploadError
            );

            if (retryCount < maxRetries) {
              // Wait before retrying (exponential backoff)
              const delay = Math.pow(2, retryCount) * 1000;
              console.log(`Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        }

        // If all upload attempts failed, use a fallback image
        if (!uploadSuccess) {
          imageUrl =
            "https://res.cloudinary.com/djlgmbop9/image/upload/q_100/logo_qrkfiv.jpg"; // High quality fallback image
          console.log(
            "❌ All upload attempts failed. Using fallback image URL:",
            imageUrl
          );
        }
      }

      try {
        await prisma.ticket.update({
          where: { id: ticketId },
          data: { qrCodeUrl: imageUrl },
        });
        console.log("✅ Ticket updated with image URL in database:", imageUrl);
      } catch (dbError) {
        console.error("❌ Error updating ticket with image URL:", dbError);
      }
    } else {
      // No ticket image provided, use fallback
      console.log("No ticket image provided, using fallback image");
      imageUrl =
        "https://res.cloudinary.com/djlgmbop9/image/upload/q_100/logo_qrkfiv.jpg"; // Default fallback image
    }

    const session = await prisma.demoSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Ensure the Cloudinary URL has optimal parameters for email display
    let finalImageUrl = imageUrl;
    if (finalImageUrl && finalImageUrl.includes("cloudinary.com")) {
      // Ensure high quality and proper format for email
      if (!finalImageUrl.includes("/q_")) {
        // Insert q_100 after /upload/ in the URL for highest quality
        finalImageUrl = finalImageUrl.replace(
          "/upload/",
          "/upload/q_100,f_auto,dpr_auto/"
        );
      }

      console.log("📧 Final optimized image URL for email:", finalImageUrl);
    } else {
      console.log("📧 Using non-Cloudinary image URL:", finalImageUrl);
    }

    console.log("🚀 Generating email template with image URL...");
    const emailTemplate = generateTicketEmailTemplate(
      name,
      session.date,
      ticketId,
      courseName,
      finalImageUrl || ""
    );

    const emailSent = await sendEmail({
      to: email,
      subject: "Your codeverse academy Registration Confirmation",
      html: emailTemplate,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send ticket email" },
        { status: 500 }
      );
    }

    console.log("✅ Ticket sent successfully to", email);
    console.log("📄 Email included image URL:", finalImageUrl);

    const adminEmailTemplate = generateAdminEmailTemplate(
      name,
      email,
      phone || "Not provided"
    );

    const AdminEmailSent = await sendEmail({
      to: "aashish17405@gmail.com",
      subject: "New Registration",
      html: adminEmailTemplate,
    });

    if (!AdminEmailSent) {
      return NextResponse.json(
        { error: "Failed to send admin email" },
        { status: 500 }
      );
    }

    console.log("✅ Admin email sent successfully to aashish17405@gmail.com");

    return NextResponse.json(
      {
        message: "Ticket email sent successfully",
        imageUrl: finalImageUrl,
        emailSent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error sending ticket email:", error);
    return NextResponse.json(
      { error: "Failed to process ticket email" },
      { status: 500 }
    );
  }
}
