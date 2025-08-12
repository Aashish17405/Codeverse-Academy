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

export interface InternshipEnrollmentData {
  name: string;
  collegeName: string;
  interestedInternship: "AI" | "WEB_DEV";
  collegeEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  homeLocation: string;
  currentLocation: string;
  attendOffline: boolean;
  certificationMode: "online" | "offline";
}

export function generateInternshipConfirmationEmail(
  formData: InternshipEnrollmentData
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
  <h1>Your codeverse academy Internship Registration Details</h1>
      </div>

      <div class="content">
        <p>Hello ${formData.name},</p>
  <p>Thank you for registering for the internship with codeverse academy! We have received your details.</p>
        
        <div class="details">
          <h3>Your Submitted Information:</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>College Name:</strong> ${formData.collegeName}</p>
          <p><strong>Email:</strong> ${formData.collegeEmail}</p>
          <p><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
          <p><strong>WhatsApp Number:</strong> ${formData.whatsappNumber}</p>
          <p><strong>Interested Internship:</strong> ${
            formData.interestedInternship
          }</p>
          <p><strong>Home Location:</strong> ${formData.homeLocation}</p>
          <p><strong>Current Location:</strong> ${formData.currentLocation}</p>
          <p><strong>Willing to attend offline:</strong> ${
            formData.attendOffline ? "Yes" : "No"
          }</p>
          <p><strong>Preferred Certification Mode:</strong> ${
            formData.certificationMode
          }</p>
        </div>

  <h3>About codeverse academy</h3>
  <p>codeverse academy is a leading provider of cutting-edge technology education. We specialize in internships and training programs that equip students with the skills they need to succeed in the tech industry.</p>
        <p><strong>Location:</strong> Suman Tower, 3rd Floor, Above ICICI Bank, Adityapur 1, Jamshedpur - 831013</p>
        <p>If you have any questions or need further assistance, please contact us at +91 74810 42783</p>
      </div>
      <div class="footer">
  <p>© ${new Date().getFullYear()} codeverse academy. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;
}
