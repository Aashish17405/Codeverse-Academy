import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail, generateTicketEmailTemplate } from "@/lib/email";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { generateAdminEmailTemplate } from "@/lib/adminEmail";

// Configure cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received ticket email request");

    // Define schema for email requests
    const emailRequestSchema = z.object({
      // ticketImage: z.string(),
      email: z.string().email(),
      name: z.string().min(2),
      phone: z.string(),
      // sessionId: z.string().uuid(),
      // ticketId: z.string(),
      courseName: z.string().optional().default("Demo Session"),
    });

    const validation = emailRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    // const { ticketImage, email, name, sessionId, ticketId, courseName } = validation.data;
    const { email, name, courseName, phone } = validation.data;

    // First check if the ticket already has a valid image URL
    // const existingTicket = await prisma.ticket.findUnique({
    //   where: { id: ticketId },
    //   select: { qrCodeUrl: true },
    // });

    // If the ticket already has a valid image URL, use it
    // let imageUrl;
    // if (existingTicket?.qrCodeUrl && existingTicket.qrCodeUrl !== "") {
    //   console.log(
    //     "Ticket already has an image URL, skipping upload:",
    //     existingTicket.qrCodeUrl
    //   );
    //   imageUrl = existingTicket.qrCodeUrl;
    // } else {
    //   // Upload the ticket image to Cloudinary with retry mechanism
    //   const maxRetries = 3;
    //   let retryCount = 0;
    //   let uploadSuccess = false;

    //   while (retryCount < maxRetries && !uploadSuccess) {
    //     try {
    //       console.log(
    //         `Starting Cloudinary upload (attempt ${
    //           retryCount + 1
    //         } of ${maxRetries})...`
    //       );

    //       // Check if the image is too large and optimize if needed
    //       const isDataUrl = ticketImage.startsWith("data:");
    //       let optimizedImage = ticketImage;

    //       if (isDataUrl && ticketImage.length > 500000) {
    //         console.log("Image is large, optimizing before upload");
    //         // Just take the image as is, but in a real app you might want to resize/compress it
    //       }

    //       // Upload with timeout and optimization options
    //       const uploadResponse = await cloudinary.uploader.upload(
    //         optimizedImage,
    //         {
    //           folder: "tickets",
    //           timeout: 60000, // 1 minute timeout per attempt
    //           quality: 100, // Set quality to 100% for high quality images
    //           fetch_format: "auto", // Let Cloudinary choose the best format
    //           public_id: `ticket-${ticketId}-${name.replace(
    //             /[^a-zA-Z0-9]/g,
    //             "-"
    //           )}`, // Set a custom public ID with the ticket ID and name
    //           resource_type: "image",
    //           overwrite: true, // Overwrite if exists
    //         }
    //       );

    //       // Get the secure URL and ensure it has the q_100 parameter
    //       imageUrl = uploadResponse.secure_url;
    //       console.log("Image uploaded to Cloudinary:", imageUrl);
    //       uploadSuccess = true;

    //       // Break out of the loop since we've successfully uploaded the image
    //       break;
    //     } catch (uploadError) {
    //       retryCount++;
    //       console.error(
    //         `Error uploading to Cloudinary (attempt ${retryCount} of ${maxRetries}):`,
    //         uploadError
    //       );

    //       if (retryCount < maxRetries) {
    //         // Wait before retrying (exponential backoff)
    //         const delay = Math.pow(2, retryCount) * 1000;
    //         console.log(`Retrying in ${delay}ms...`);
    //         await new Promise((resolve) => setTimeout(resolve, delay));
    //       }
    //     }
    //   }

    //   // If all upload attempts failed, use a fallback image
    //   if (!uploadSuccess) {
    //     imageUrl =
    //       "https://res.cloudinary.com/djlgmbop9/image/upload/q_100/logo_qrkfiv.jpg"; // High quality fallback image
    //     console.log(
    //       "All upload attempts failed. Using fallback image URL:",
    //       imageUrl
    //     );
    //   }

    //   try {
    //     await prisma.ticket.update({
    //       where: { id: ticketId },
    //       data: { qrCodeUrl: imageUrl },
    //     });
    //     console.log("Ticket updated with image URL:", imageUrl);
    //   } catch (dbError) {
    //     console.error("Error updating ticket with image URL:", dbError);
    //   }
    // }

    const session = await prisma.demoSession.findUnique({
      where: { id: "5a66db11-ad7d-4297-8526-37b9fc7a19fa" },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Ensure the Cloudinary URL has the q_100 parameter for high quality
    // let highQualityImageUrl = imageUrl;
    // if (highQualityImageUrl && highQualityImageUrl.includes("cloudinary.com")) {
    //   // Check if the URL already contains 'q_' parameter
    //   if (!highQualityImageUrl.includes("/q_")) {
    //     // Insert q_100 after /upload/ in the URL
    //     highQualityImageUrl = highQualityImageUrl.replace(
    //       "/upload/",
    //       "/upload/q_100/"
    //     );
    //   }

    //   // Add fl_attachment and filename parameters to force download with correct filename
    //   if (!highQualityImageUrl.includes("fl_attachment")) {
    //     // Add fl_attachment and a specific filename
    //     highQualityImageUrl = highQualityImageUrl.includes("?")
    //       ? `${highQualityImageUrl}&fl_attachment:AstratechAI%20Ticket.png`
    //       : `${highQualityImageUrl}?fl_attachment:AstratechAI%20Ticket.png`;
    //   }
    // }

    const ticketId = "asdfasdfasdf";
    const emailTemplate = generateTicketEmailTemplate(
      name,
      session.date,
      ticketId,
      courseName
      // highQualityImageUrl || ""
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

    const adminEmailTemplate = generateAdminEmailTemplate(name, email, phone);

    const AdminEmailSent = await sendEmail({
      to: "www.allinoneforyouhere@gmail.com",
      // to: "aashish17405@gmail.com",
      subject: "New Registration",
      html: adminEmailTemplate,
    });

    if (!AdminEmailSent) {
      return NextResponse.json(
        { error: "Failed to send admin email" },
        { status: 500 }
      );
    }

    console.log(
      "✅ Admin email sent successfully to",
      "www.allinoneforyouhere@gmail.com"
    );

    return NextResponse.json(
      {
        message: "Ticket email sent successfully",
        // imageUrl,
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
