export const site = {
  name: "Daphna Awadish",
  description:
    "Wholesale postcards and custom illustration for shops and brands.",
  defaultMoq: 12,
  currency: "EUR",
  contactEmail: "hello@daphnaawadish.com",
  instagramUrl: "",
  projectTypes: ["Branding", "Packaging", "Custom Postcard", "Editorial"],
  budgetRanges: [
    "Under €500",
    "€500–€1,500",
    "€1,500–€3,000",
    "€3,000–€6,000",
    "€6,000+",
    "Not sure yet",
  ],
  timelines: ["2–4 weeks", "1–2 months", "3+ months", "Flexible"],
} as const;

export const about = {
  role: "Illustrator",
  paragraphs: [
    "Placeholder: Daphna Awadish makes illustrated postcards for shops, museums, and brands. Replace this with her short biography.",
    "Placeholder: she works from observation, in small wholesale editions and in commissions for packaging, identity, and editorial stories.",
    "Placeholder: the wholesale program is for boutiques and stockists who want a coherent collection they can reorder.",
  ],
  collaborations: ["Placeholder collaboration"],
};

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}
