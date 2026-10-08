import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import sharp from "sharp";
import type { Postcard } from "../lib/types";

const catalogPath = path.join("public", "data", "postcards.json");
const imageDir = "RawImagesPostcards";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!existsSync(file)) return;

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    let value = raw.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function findImage(imageFilename: string, files: string[]) {
  const match = files.find(
    (file) => file.toLowerCase() === imageFilename.toLowerCase(),
  );
  return match ? path.join(imageDir, match) : null;
}

async function main() {
  loadEnvLocal();
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing from .env.local.");
  }
  if (!existsSync(catalogPath)) {
    throw new Error("public/data/postcards.json is missing. Run the parser first.");
  }

  const postcards = JSON.parse(readFileSync(catalogPath, "utf8")) as Postcard[];
  const files = readdirSync(imageDir).filter((file) =>
    file.toLowerCase().endsWith(".jfif"),
  );

  let uploaded = 0;
  for (const postcard of postcards) {
    const source = findImage(postcard.imageFilename, files);
    if (!source) {
      console.warn(`Missing image for ${postcard.imageFilename}`);
      continue;
    }

    const originalBytes = statSync(source).size;
    const body = await sharp(source)
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 78 })
      .toBuffer();
    const pathname = postcard.imageFilename.replace(/\.jfif$/i, ".webp");
    const blob = await put(pathname, body, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    postcard.blobUrl = blob.url;
    uploaded += 1;
    writeFileSync(catalogPath, `${JSON.stringify(postcards, null, 2)}\n`);
    console.log(
      `${postcard.imageFilename} ${(originalBytes / 1024).toFixed(0)}KB -> ${pathname} ${(body.length / 1024).toFixed(0)}KB`,
    );
  }

  console.log(`Uploaded ${uploaded} of ${postcards.length} postcards.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
