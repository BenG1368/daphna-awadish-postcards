export const site = {
  name: "Daphna Awadish",
  description:
    "Wholesale postcards and custom illustration for shops and brands.",
  defaultMoq: 12,
  currency: "EUR",
  contactEmail: "daphna.awadish@gmail.com",
  instagramUrl: "https://www.instagram.com/daphna_awadish",
  budgetRanges: [
    "Under €500",
    "€500–€1,500",
    "€1,500–€3,000",
    "€3,000+",
    "Not sure yet",
  ],
  timelines: ["2–4 weeks", "1–2 months", "3+ months", "Flexible"],
} as const;

export const about = {
  name: "Daphna Awadish Golan",
  role: "Animation filmmaker and illustrator",
  paragraphs: [
    "Daphna Awadish Golan is an award-winning animation filmmaker and illustrator based in Amsterdam. Using a rich blend of tactile mixed media, her animated documentaries craft personal stories that center on memory, identity, and belonging.",
    "Her short films, including Swimming With Wings, Bear With Me, and Journey Birds, have screened in international festivals and received awards worldwide. Daphna specializes in working with archives, and she is currently working on a new graphic novel and a short animated documentary.",
    "In addition to her film work, Daphna works as an independent illustrator specializing in book illustration, branding, and custom visual art. She holds a BFA from the Bezalel Academy of Art and Design and an MA from the St. Joost Master Institute of Visual Cultures. A former lecturer in animation at the Willem de Kooning Academy in Rotterdam, she also gives guest lectures and workshops internationally.",
  ],
  collaborations: [] as string[],
};

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}
