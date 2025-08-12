import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 587,
  secure: false,
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
      from: `"Codeverse Academy" <${process.env.EMAIL_USER}>`,
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .qr-code-container {
          text-align: center;
          margin: 20px 0;
          width: 100%;
        }
        .qr-code-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .qr-code-img {
          width: 100%;
          max-width: 500px;
          height: auto;
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
      <div class="header">
    <img src="https://res.cloudinary.com/djlgmbop9/image/upload/q_100/logo_qrkfiv" 
      alt="Codeverse Academy Logo" 
            width="75" 
            height="75">
  <h1>Your Codeverse Academy Demo Session Ticket</h1>
      </div>

      <div class="content">
        <p>Hello ${userName},</p>
  <p>Thank you for booking a demo session with Codeverse Academy! Your ticket has been confirmed.</p>
        
        <div class="details">
          <p><strong>Session Date:</strong> ${formattedDate}</p>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Status:</strong> Confirmed</p>
          <p><strong>Location:</strong> Suman Tower, 3rd Floor, Above ICICI Bank, Adityapur 1, Jamshedpur – 831013</p>
        </div>
        
        <p>Please present the QR code when you arrive at our center.</p>

        <div class="qr-code-container">
          <div class="qr-code-wrapper">
            
          </div>
        </div>
        
        <p>If you have any questions or need to reschedule, please contact us at +91 74810 42783</p>
      </div>
      <div class="footer">
  <p>© ${new Date().getFullYear()} Codeverse Academy. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;
}

export interface PaymentConfirmationData {
  name: string;
  collegeEmail: string;
  interestedInternship: string;
}

export function generatePaymentConfirmationEmail(
  formData: PaymentConfirmationData
): string {
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
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
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
        <div class="header">
      <img src="https://res.cloudinary.com/djlgmbop9/image/upload/q_100/logo_qrkfiv" 
        alt="Codeverse Academy Logo" 
              width="75" 
              height="75">
          <h1>Codeverse Academy Internship Payment Confirmation</h1>
        </div>
  
        <div class="content">
          <p>Hello ${formData.name},</p>
          <p>We are pleased to inform you that your payment for the Codeverse Academy internship has been successfully processed. Welcome aboard!</p>
          
          <div class="details">
            <h3>Confirmation Details:</h3>
            <p><strong>Internship Program:</strong> ${
              formData.interestedInternship
            }</p>
          </div>
  
          <h3>Next Steps</h3>
          <p>Our team will contact you shortly with the next steps, including course materials, schedules, and orientation details. Please keep an eye on your email.</p>
          <p>If you have any immediate questions, feel free to reach out to us at +91 74810 42783.</p>

          <div style="margin-top: 30px; padding: 15px; background: #e0f7fa; border-radius: 5px; text-align: center;">
            <strong>Stay Updated!</strong><br/>
            Join our official WhatsApp group for the latest updates and important announcements:<br/>
            <a href="https://chat.whatsapp.com/EKLUYTVlYZJBf1y80tGSd4?mode=ac_c" style="color: #0077b6; font-weight: bold; text-decoration: underline;" target="_blank">Join WhatsApp Group</a>
          </div>
        </div>
  
        <div class="footer">
          <p>© ${new Date().getFullYear()} Codeverse Academy. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </body>
      </html>
    `;
}
