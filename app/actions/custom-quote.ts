"use server";

import { sendInquiryEmail } from "@/lib/email";
import type { ActionResult } from "@/lib/types";
import { customQuoteSchema } from "@/lib/validators";

export async function submitCustomQuote(input: unknown): Promise<ActionResult> {
  const parsed = customQuoteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const text = [
    `Business: ${data.businessName}`,
    `Email: ${data.email}`,
    `Budget: ${data.budget}`,
    `Due date: ${data.timeline}`,
    "",
    "Brief:",
    data.brief,
  ].join("\n");

  try {
    await sendInquiryEmail(
      `Custom illustration — ${data.businessName}`,
      text,
      data.email,
    );
    return { ok: true };
  } catch (error) {
    console.error(
      "Custom quote email failed",
      error instanceof Error ? error.message : "unknown",
    );
    return { ok: false, message: "Message could not be sent. Please try again." };
  }
}
