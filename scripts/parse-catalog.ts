import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { titleFromName, stem } from "../lib/titles";
import type { Postcard } from "../lib/types";

type SheetRow = {
  name: string;
  imageFilename: string;
  category: string;
};

const defaultInput = "DaphnaPostcardsCatalog.csv";
const defaultOutput = path.join("public", "data", "postcards.json");

function readArgs(argv: string[]) {
  const positional: string[] = [];
  let out = defaultOutput;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--out") {
      out = argv[index + 1] ?? out;
      index += 1;
      continue;
    }
    if (arg === "--blob-base-url") {
      index += 1;
      continue;
    }
    positional.push(arg);
  }

  return { input: positional[0] ?? defaultInput, out };
}

function parseCsv(file: string): string[][] {
  const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

async function readTable(file: string): Promise<string[][]> {
  const extension = path.extname(file).toLowerCase();
  if (extension === ".xlsx" || extension === ".xls") {
    const { readFile, utils } = await import("xlsx");
    const workbook = readFile(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json<(string | number | null)[]>(sheet, {
      header: 1,
      raw: false,
      defval: "",
    });
    return rows.map((row) => row.map((cell) => String(cell ?? "").trim()));
  }
  return parseCsv(file);
}

function rowsFromTable(table: string[][]): SheetRow[] {
  const [header, ...body] = table;
  if (!header) {
    throw new Error("The sheet has no header row.");
  }

  const columns = new Map(header.map((name, index) => [name, index]));
  const fileIndex = columns.get("FileName");
  const categoryIndex = columns.get("Category");
  const nameIndex = columns.get("PoscardName");

  if (fileIndex === undefined || categoryIndex === undefined || nameIndex === undefined) {
    throw new Error("The sheet must include PoscardName, FileName, and Category.");
  }

  const rows: SheetRow[] = [];
  const seen = new Set<string>();

  body.forEach((row, index) => {
    const line = index + 2;
    const imageFilename = row[fileIndex] ?? "";
    const name = row[nameIndex] ?? "";
    const category = row[categoryIndex] || "Uncategorized";

    if (!imageFilename) {
      console.warn(`Skipped row ${line}: empty FileName.`);
      return;
    }
    if (!name) {
      console.warn(`Skipped row ${line}: empty PoscardName.`);
      return;
    }
    if (seen.has(imageFilename)) {
      console.warn(`Skipped row ${line}: duplicate file ${imageFilename}.`);
      return;
    }
    if (stem(name).toLowerCase() !== stem(imageFilename).toLowerCase()) {
      console.warn(`Row ${line}: name "${name}" does not match file "${imageFilename}".`);
    }

    seen.add(imageFilename);
    rows.push({ name, imageFilename, category });
  });

  return rows;
}

function readExisting(file: string): Postcard[] {
  if (!existsSync(file)) return [];
  const parsed = JSON.parse(readFileSync(file, "utf8")) as Postcard[];
  return Array.isArray(parsed) ? parsed : [];
}

function nextId(current: number) {
  return `postcard-${String(current).padStart(3, "0")}`;
}

function buildCatalog(rows: SheetRow[], existing: Postcard[]): Postcard[] {
  const byFile = new Map(existing.map((postcard) => [postcard.imageFilename, postcard]));
  let highest = existing.reduce((max, postcard) => {
    const value = Number(postcard.id.replace("postcard-", ""));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return rows.map((row) => {
    const derived = titleFromName(row.name);
    const previous = byFile.get(row.imageFilename);

    if (previous) {
      return {
        ...previous,
        title: previous.title && previous.title !== derived ? previous.title : derived,
        category: row.category,
        tags: previous.tags.length > 0 ? previous.tags : [row.category],
        description: previous.description,
        blobUrl: previous.blobUrl,
        suggestedRetail: previous.suggestedRetail,
        moq: previous.moq,
      };
    }

    highest += 1;
    return {
      id: nextId(highest),
      title: derived,
      category: row.category,
      imageFilename: row.imageFilename,
      blobUrl: "",
      tags: [row.category],
      description: "",
      suggestedRetail: null,
      moq: null,
    };
  });
}

async function main() {
  const { input, out } = readArgs(process.argv.slice(2));
  if (!existsSync(input)) {
    throw new Error(`Catalog file not found: ${input}`);
  }

  const existing = readExisting(out);
  const rows = rowsFromTable(await readTable(input));
  const catalog = buildCatalog(rows, existing);
  const known = new Set(existing.map((postcard) => postcard.imageFilename));
  const created = catalog.filter((postcard) => !known.has(postcard.imageFilename)).length;

  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(
    `Read ${rows.length} postcards. Wrote ${catalog.length}. New ids: ${created}. Output: ${out}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
