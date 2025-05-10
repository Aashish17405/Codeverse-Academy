import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"CODEVERSE ACADEMY" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export function generateTicketEmailTemplate(
  userName: string,
  sessionDate: Date,
  ticketId: string,
  courseName: string
): string {
  const formattedDate = new Date(sessionDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
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
        .qr-code {
          text-align: center;
          margin: 20px 0;
        }
        .qr-code img {
          max-width: 200px;
        }
        .details {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
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
      <div class="header" style="display: flex; align-items: center; gap: 10px;">
        <img src="https://res.cloudinary.com/djlgmbop9/image/upload/q_100/logo_qrkfiv" 
            alt="Codeverse Logo" 
            width="75" 
            height="75">
        <h1>Your Codeverse Demo Session Ticket</h1>
      </div>

      <div class="content">
        <p>Hello ${userName},</p>
        <p>Thank you for booking a demo session with Codeverse! Your ticket has been confirmed.</p>
        
        <div class="details">
          <p><strong>Session Date:</strong> ${formattedDate}</p>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Status:</strong> Confirmed</p>
          <p><strong>Location:</strong> Suman Tower, 3rd Floor, Above ICICI Bank, Adityapur 1, Jamshedpur – 831013</p>
        </div>
        
        <p>Please present the QR code when you arrive at our center.</p>
        
        <p>If you have any questions or need to reschedule, please contact us at +91 74810 42783</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Codeverse. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;
}
