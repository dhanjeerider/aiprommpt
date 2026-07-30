const JUNK = /(\d+\s*prompts?)$/i;

/**
 * Cleans scraped tag noise like "P Portraits 270 Prompts" -> dropped,
 * and de-duplicates tags case-insensitively.
 */
export function cleanTags(tags: string[] | null | undefined): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of tags ?? []) {
    let t = String(raw ?? "").replace(/^#+/, "").trim();
    if (!t) continue;
    // drop counter tags: "Portraits 270 Prompts", "P Portraits 270 Prompts"
    if (JUNK.test(t)) continue;
    // drop stray single-letter prefix: "P Portraits" -> "Portraits"
    t = t.replace(/^([A-Za-z])\s+(?=[A-Z])/, "");
    t = t.replace(/\s{2,}/g, " ").trim();
    if (!t || t.length < 2) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}
