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
    `Project type: ${data.projectType}`,
    `Budget: ${data.budget}`,
    `Timeline: ${data.timeline}`,
    "",
    "Brief:",
    data.brief,
  ].join("\n");

  try {
    await sendInquiryEmail(`Custom illustration — ${data.businessName}`, text);
    return { ok: true };
  } catch {
    return { ok: false, message: "Message could not be sent." };
  }
}
