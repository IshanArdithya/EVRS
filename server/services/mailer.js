import "dotenv/config";
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM = '"EVRS Support" <no-reply@evrs.gov>',
} = process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true",
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

export async function sendMail(opts) {
  return transporter.sendMail({ from: MAIL_FROM, ...opts });
}

export async function verifyMailer() {
  try {
    await transporter.verify();
    console.log("SMTP ready");
  } catch (e) {
    console.error("SMTP verify failed:", e);
  }
}
