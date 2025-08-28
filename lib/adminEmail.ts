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

export function generateAdminEmailTemplate(
  userName: string,
  email: string,
  phone: string
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
          margin: 20px 0;
        }
        .detail-row {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .detail-label {
          font-weight: bold;
          min-width: 100px;
          color: #0077b6;
        }
        .detail-value {
          color: #333;
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
        <img src="https://res.cloudinary.com/djlgmbop9/image/upload/q_100/logo_i3joxe" 
            alt="Codeverse Academy Logo" 
            width="75" 
            height="75">
  <h1>New codeverse academy Registration Details</h1>
      </div>

      <div class="content">        
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${userName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${phone}</span>
          </div>
        </div>
      </div>
      <div class="footer">
  <p>© ${new Date().getFullYear()} Codeverse Academy. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;
}
