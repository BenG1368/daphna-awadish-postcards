export type Postcard = {
  id: string;
  title: string;
  category: string;
  imageFilename: string;
  blobUrl: string;
  orientation?: "portrait" | "landscape";
  tags: string[];
  description: string;
  suggestedRetail: number | null;
  moq: number | null;
};

export type InquiryItem = {
  id: string;
  title: string;
  category: string;
  imageFilename: string;
  blobUrl: string;
  quantity: number;
  moq: number;
};

export type ActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
