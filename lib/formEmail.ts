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

export interface FormEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendFormEmail({
  to,
  subject,
  html,
}: FormEmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Codeverse Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Error sending form email:", error);
    return false;
  }
}
