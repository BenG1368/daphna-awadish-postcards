import { Resend } from "resend";

export async function sendInquiryEmail(
  subject: string,
  text: string,
  replyTo?: string,
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.INQUIRY_TO_EMAIL?.trim();
  const from = process.env.INQUIRY_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) {
    console.error(
      "Inquiry email is missing RESEND_API_KEY, INQUIRY_TO_EMAIL, or INQUIRY_FROM_EMAIL",
    );
    throw new Error("Email is not configured");
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to,
    subject,
    text,
    replyTo,
  });

  if (result.error || !result.data?.id) {
    console.error(
      "Resend rejected the inquiry",
      result.error?.message ?? "no email id",
    );
    throw new Error("Resend rejected the message");
  }
}
