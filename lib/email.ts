import { Resend } from "resend";

export async function sendInquiryEmail(subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new Error("Email is not configured");
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({ from, to, subject, text });
  if (result.error) {
    throw new Error("Resend rejected the message");
  }
}
