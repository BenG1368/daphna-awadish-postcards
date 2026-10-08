const ALIASES: Array<[RegExp, string]> = [[/Christmess/g, "Christmas"]];

export function stem(value: string) {
  return value.replace(/\.[^.]+$/, "").trim();
}

export function titleFromName(name: string) {
  let value = stem(name);
  for (const [pattern, replacement] of ALIASES) {
    value = value.replace(pattern, replacement);
  }

  value = value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replace(/([a-z])and(?=\s|[A-Z])/g, "$1 and")
    .replace(/\s+/g, " ")
    .trim();

  if (!value) return "Untitled";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
