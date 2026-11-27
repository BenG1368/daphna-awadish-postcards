export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  kind: "photo" | "artwork";
  objectPosition?: string;
};

export type GalleryRow =
  | {
      layout: "pair";
      aspect: "portrait" | "square" | "artwork";
      items: readonly [GalleryItem, GalleryItem];
    }
  | {
      layout: "full";
      items: readonly [GalleryItem];
    };

export type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  location: string;
  scope: readonly string[];
  summary: string;
  story: string;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
    objectPosition?: string;
  };
  gallery: readonly GalleryRow[];
};

export type SingleCommission = {
  id: string;
  name: string;
  category: string;
  location: string;
  deliverable: string;
  summary: string;
  image: GalleryItem;
};

export const capabilities = [
  {
    number: "01",
    title: "Packaging & unboxing",
    description:
      "Takeaway cups, pastry boxes, flavor guides, and thank-you cards that turn orders into keepsakes.",
  },
  {
    number: "02",
    title: "Mascots & signage",
    description:
      "Illustrated characters, shop logos, storefront window decals, and sidewalk boards.",
  },
  {
    number: "03",
    title: "Shop merchandise",
    description:
      "Retail-ready canvas tote bags, bookmarks, custom postcards, and paper goods.",
  },
  {
    number: "04",
    title: "Editorial & seasonal",
    description:
      "Spot illustrations for menus, websites, holiday releases, and brand storytelling.",
  },
] as const;

export const processSteps = [
  {
    number: "01",
    title: "Share your brief",
    description:
      "Tell me about your business, what you want to create, and your timeline. I reply with a clear quote.",
  },
  {
    number: "02",
    title: "Sketches & direction",
    description:
      "I share rough compositions and visual directions so we align on mood and details before final artwork.",
  },
  {
    number: "03",
    title: "Print-ready artwork",
    description:
      "You receive high-resolution files prepared for your exact printers—cups, boxes, totes, or window vinyl.",
  },
] as const;

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "artichoc",
    name: "ArtiChoc",
    category: "Chocolatier",
    location: "Amsterdam",
    scope: ["Packaging", "Takeaway cups", "Flavor guide", "Order cards"],
    summary:
      "Illustrated takeaway cups, seasonal flavor guides, thank-you order cards, and chocolate-making visuals.",
    story:
      "Partnered with Amsterdam artisanal chocolatier ArtiChoc to bring warmth and storytelling to their everyday touchpoints. Cohesive illustrations across takeaway cups, seasonal chocolate flavor guides, thank-you order inserts, and process drawings turned each purchase into something giftable.",
    cover: {
      src: "/partnerships/artichoc/cup.jpg",
      alt: "Illustrated ArtiChoc takeaway cup on a wooden board with pieces of chocolate, in the shop.",
      width: 1012,
      height: 1800,
      objectPosition: "55% 74%",
    },
    gallery: [
      {
        layout: "pair",
        aspect: "portrait",
        items: [
          {
            src: "/partnerships/artichoc/cup.jpg",
            alt: "Illustrated ArtiChoc takeaway cup on a wooden board with pieces of chocolate, in the shop.",
            caption: "Illustrated takeaway cup on the shop counter",
            width: 1012,
            height: 1800,
            kind: "photo",
            objectPosition: "55% 74%",
          },
          {
            src: "/partnerships/artichoc/cards.jpg",
            alt: "Two printed ArtiChoc thank-you cards showing a hand reaching into a box of chocolates.",
            caption: "Printed thank-you cards included with orders",
            width: 1013,
            height: 1800,
            kind: "photo",
            objectPosition: "50% 50%",
          },
        ],
      },
      {
        layout: "pair",
        aspect: "square",
        items: [
          {
            src: "/partnerships/artichoc/box.jpg",
            alt: "Open box of ArtiChoc chocolates with the illustrated flavor guide and shop lid.",
            caption: "Seasonal chocolate box paired with the printed flavor guide",
            width: 960,
            height: 960,
            kind: "photo",
          },
          {
            src: "/partnerships/artichoc/canal.jpg",
            alt: "The chocolate-tower illustration printed as a card, held up beside an Amsterdam canal.",
            caption: "Printed postcard edition held beside an Amsterdam canal",
            width: 1080,
            height: 1080,
            kind: "photo",
          },
        ],
      },
      {
        layout: "full",
        items: [
          {
            src: "/partnerships/artichoc/flavors.jpg",
            alt: "Illustrated Easter egg flavor guide for ArtiChoc, with a Dutch flavor name under each egg.",
            caption: "Seasonal Easter egg flavor guide — original illustration",
            width: 1772,
            height: 1181,
            kind: "artwork",
          },
        ],
      },
      {
        layout: "pair",
        aspect: "artwork",
        items: [
          {
            src: "/partnerships/artichoc/tower.jpg",
            alt: "Illustration of a tall stack of chocolates on a cake stand in a warm living room with a cat.",
            caption: "Chocolate tower editorial illustration",
            width: 1772,
            height: 1181,
            kind: "artwork",
          },
          {
            src: "/partnerships/artichoc/making.jpg",
            alt: "Spot illustrations of chocolate making for ArtiChoc, from the cacao pod to cut squares.",
            caption: "Chocolate-making process spot illustrations",
            width: 1343,
            height: 1800,
            kind: "artwork",
          },
        ],
      },
    ],
  },
  {
    slug: "book-nook",
    name: "The Book Nook",
    category: "Independent Bookshop",
    location: "Amsterdam",
    scope: ["Brand mascot", "Storefront signage", "Tote bags", "Packaging"],
    summary:
      "A reading lemur mascot adapted for storefront decals, sidewalk signage, paper bags, bookmarks, and totes.",
    story:
      "Created a signature brand mascot—a reading lemur with a cup of coffee—for independent Amsterdam bookshop The Book Nook on Singel 82. The artwork was designed to scale cleanly from street-level window decals and sidewalk boards to branded paper bags, bookmarks, and screen-printed canvas tote bags.",
    cover: {
      src: "/partnerships/book-nook/window.jpg",
      alt: "The Book Nook shop window, with the reading lemur and shop name on the glass.",
      width: 1350,
      height: 1800,
      objectPosition: "50% 52%",
    },
    gallery: [
      {
        layout: "pair",
        aspect: "portrait",
        items: [
          {
            src: "/partnerships/book-nook/window.jpg",
            alt: "The Book Nook shop window, with the reading lemur and shop name on the glass.",
            caption: "Storefront window decal on Singel 82",
            width: 1350,
            height: 1800,
            kind: "photo",
            objectPosition: "50% 52%",
          },
          {
            src: "/partnerships/book-nook/sign.jpg",
            alt: "Blue sidewalk sign for The Book Nook, with the lemur and the words Come in, we're open.",
            caption: "Sidewalk A-frame sign outside the shop",
            width: 1350,
            height: 1800,
            kind: "photo",
            objectPosition: "50% 58%",
          },
        ],
      },
      {
        layout: "pair",
        aspect: "portrait",
        items: [
          {
            src: "/partnerships/book-nook/totes.jpg",
            alt: "Canvas tote bags printed with the lemur riding a bicycle and the address Singel 82, Amsterdam.",
            caption: "Screen-printed canvas tote bags sold in store",
            width: 1350,
            height: 1800,
            kind: "photo",
            objectPosition: "50% 56%",
          },
          {
            src: "/partnerships/book-nook/bag.jpg",
            alt: "Kraft paper bag and a bookmark, both printed with the Book Nook lemur.",
            caption: "Branded kraft paper bag and printed bookmark",
            width: 1013,
            height: 1800,
            kind: "photo",
            objectPosition: "50% 52%",
          },
        ],
      },
      {
        layout: "full",
        items: [
          {
            src: "/partnerships/book-nook/mascot.jpg",
            alt: "The Book Nook logo: a purple reading lemur sitting above the shop name.",
            caption: "Original reading lemur mascot & logotype",
            width: 1170,
            height: 1088,
            kind: "artwork",
          },
        ],
      },
    ],
  },
  {
    slug: "dr-falafel",
    name: "Dr. Falafel",
    category: "Street Food Kiosk",
    location: "Amsterdam",
    scope: ["Character portrait", "Window decals", "Life-size cutout"],
    summary:
      "An illustrated portrait of the owner scaled up for storefront window decals and a life-size shop cutout.",
    story:
      "Illustrated a warm, recognizable portrait of the owner for Dr. Falafel in Amsterdam—holding a coffee and a freshly made bowl of falafel. The character welcomes passersby across the corner kiosk windows and stands as a life-size cutout beside the entrance.",
    cover: {
      src: "/partnerships/dr-falafel/window.jpg",
      alt: "Dr. Falafel window decal of the owner holding a coffee and a bowl of falafel.",
      width: 900,
      height: 1600,
      objectPosition: "45% 48%",
    },
    gallery: [
      {
        layout: "full",
        items: [
          {
            src: "/partnerships/dr-falafel/kiosk.jpg",
            alt: "The Dr. Falafel kiosk on a sunny Amsterdam street, with the illustrated figure on the front windows.",
            caption: "Corner street kiosk with illustrated decals on both windows",
            width: 1024,
            height: 768,
            kind: "photo",
          },
        ],
      },
      {
        layout: "pair",
        aspect: "portrait",
        items: [
          {
            src: "/partnerships/dr-falafel/window.jpg",
            alt: "Dr. Falafel window decal of the owner holding a coffee and a bowl of falafel.",
            caption: "Front window vinyl decal at street level",
            width: 900,
            height: 1600,
            kind: "photo",
            objectPosition: "42% 48%",
          },
          {
            src: "/partnerships/dr-falafel/cutout.jpg",
            alt: "The owner of Dr. Falafel seated beside a life-size cutout of the illustration.",
            caption: "The owner seated beside the life-size cutout",
            width: 960,
            height: 960,
            kind: "photo",
            objectPosition: "36% 45%",
          },
        ],
      },
      {
        layout: "full",
        items: [
          {
            src: "/partnerships/dr-falafel/portrait.jpg",
            alt: "The Dr. Falafel illustration on white: a bearded man in an apron holding coffee and falafel.",
            caption: "Original character illustration",
            width: 1800,
            height: 1800,
            kind: "artwork",
          },
        ],
      },
    ],
  },
];

export const singleCommissions: readonly SingleCommission[] = [
  {
    id: "broer-zus",
    name: "Broer & Zus",
    category: "Children's Shop",
    location: "Amsterdam",
    deliverable: "Custom shop postcard",
    summary:
      "A bespoke illustrated card featuring a classic canal house, baby outfit, and bicycle for the Amsterdam children's boutique.",
    image: {
      src: "/partnerships/broer-zus/card.jpg",
      alt: "An illustrated card for Broer & Zus held in front of the shop window, showing a canal house, baby outfit, and bicycle.",
      caption: "Custom illustrated card photographed outside Broer & Zus",
      width: 720,
      height: 960,
      kind: "photo",
      objectPosition: "50% 56%",
    },
  },
  {
    id: "la-petite-deli",
    name: "La Petite Deli",
    category: "Patisserie & Deli",
    location: "Amsterdam",
    deliverable: "Illustrated pastry box",
    summary:
      "A custom storefront illustration printed on take-home cake and pastry boxes displayed at the patisserie counter.",
    image: {
      src: "/partnerships/la-petite-deli/box.jpg",
      alt: "A white cake box illustrated for La Petite Deli, sitting in the pastry case.",
      caption: "Illustrated pastry box in the display case at La Petite Deli",
      width: 1080,
      height: 1080,
      kind: "photo",
      objectPosition: "50% 62%",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}

export function getCaseStudyImages(project: CaseStudy): GalleryItem[] {
  return project.gallery.flatMap((row) => [...row.items]);
}

export function getNextCaseStudy(slug: string): CaseStudy {
  const index = caseStudies.findIndex((item) => item.slug === slug);
  return caseStudies[(index + 1) % caseStudies.length];
}
