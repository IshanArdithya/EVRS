import twilio from "twilio";
import { wa } from "../utils/phone-lk.js";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } =
  process.env;

export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function sendWhatsApp({ to, body, statusCallback }) {
  return twilioClient.messages.create({
    from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
    to: wa(to),
    body,
    ...(statusCallback ? { statusCallback } : {}),
  });
}

export async function sendWhatsAppOTP(to, code) {
  return sendWhatsApp({
    to,
    body: `Your EVRS verification code is ${code}. It expires in 15 minutes.`,
  });
}
