import { z } from "zod";
import { site } from "@/lib/site";

const quantity = z.number().int().min(1).max(999);

export const inquiryItemSchema = z.object({
  id: z.string().min(1),
  quantity,
});

export const wholesaleContactSchema = z.object({
  businessName: z.string().trim().min(2, "Enter the business name.").max(120),
  contactName: z.string().trim().min(2, "Enter a contact name.").max(120),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const wholesaleInquirySchema = wholesaleContactSchema.extend({
  items: z.array(inquiryItemSchema).min(1),
});

export const customQuoteSchema = z.object({
  businessName: z.string().trim().min(2, "Enter the business name.").max(120),
  email: z.string().trim().email("Enter a valid email."),
  projectType: z.enum(site.projectTypes, "Choose a project type."),
  budget: z.enum(site.budgetRanges, "Choose a budget range."),
  timeline: z.enum(site.timelines, "Choose a timeline."),
  brief: z.string().trim().min(20, "Add a short brief.").max(4000),
});

export type WholesaleContactInput = z.infer<typeof wholesaleContactSchema>;
export type WholesaleInquiryInput = z.infer<typeof wholesaleInquirySchema>;
export type CustomQuoteInput = z.infer<typeof customQuoteSchema>;
