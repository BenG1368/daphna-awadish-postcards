"use server";

import { getPostcards, resolvedMoq } from "@/lib/catalog";
import { sendInquiryEmail } from "@/lib/email";
import type { ActionResult } from "@/lib/types";
import { wholesaleInquirySchema } from "@/lib/validators";

export async function submitWholesaleInquiry(
  input: unknown,
): Promise<ActionResult> {
  const parsed = wholesaleInquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const catalog = getPostcards();
  const lines = [];
  for (const item of parsed.data.items) {
    const postcard = catalog.find((entry) => entry.id === item.id);
    if (!postcard) {
      return { ok: false, message: "Message could not be sent." };
    }
    const moq = resolvedMoq(postcard);
    if (item.quantity < moq) {
      return {
        ok: false,
        message: `Minimum order for ${postcard.title} is ${moq}.`,
      };
    }
    lines.push({ postcard, quantity: item.quantity });
  }

  const { businessName, contactName, email, phone, notes } = parsed.data;
  const text = [
    `Business: ${businessName}`,
    `Contact: ${contactName}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    `Notes: ${notes || "—"}`,
    "",
    "Designs:",
    ...lines.map(
      ({ postcard, quantity }) =>
        `- ${postcard.id} | ${postcard.title} | ${postcard.category} | ${postcard.imageFilename} | qty ${quantity}`,
    ),
  ].join("\n");

  try {
    await sendInquiryEmail(`Wholesale inquiry — ${businessName}`, text);
    return { ok: true };
  } catch {
    return { ok: false, message: "Message could not be sent." };
  }
}
