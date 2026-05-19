import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, checkInDate, checkOutDate, guests, message } = body;

    const smtpUser = process.env.SMTP_EMAIL;
    const smtpPass = process.env.SMTP_PASSWORD;

    const shouldSend = smtpUser && smtpPass;

    if (!shouldSend) {
      console.warn("SMTP not configured — inquiry logged:", { name, email, checkInDate });
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: smtpUser,
        to: "jxjwilliam@gmail.com",
        subject: `Property inquiry from ${name}`,
        html: `
          <h2>New Property Inquiry</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Check-in date</td><td style="padding:8px;border:1px solid #ddd">${checkInDate}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Check-out date</td><td style="padding:8px;border:1px solid #ddd">${checkOutDate}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Guests</td><td style="padding:8px;border:1px solid #ddd">${guests}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${message || "—"}</td></tr>
          </table>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send inquiry email:", error);
    return NextResponse.json({ success: true, note: "Inquiry logged" });
  }
}
