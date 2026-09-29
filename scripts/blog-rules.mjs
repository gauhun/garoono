// House style for garoono.in posts, enforced before every build.
// One sentence per line, no full stops, no dashes, no AI filler, every stat sourced.

const BANNED = [
  // BRAND.md taboo list
  "in today's fast-paced world",
  "game-changer",
  "game changer",
  "revolutionary",
  "unlock your potential",
  "unleash",
  "dive in",
  "dive into",
  "deep dive",
  "it's no secret",
  "look no further",
  "supercharge",
  "in conclusion",
  "the world of",
  // common AI tells
  "delv",
  "tapestry",
  "navigate the",
  "ever-evolving",
  "ever evolving",
  "realm",
  "embark",
  "elevate",
  "harness",
  "seamless",
  "leverage",
  "robust",
  "furthermore",
  "moreover",
  "in this article",
  "whether you're a",
  "let's explore",
  "buckle up",
  "at the end of the day",
  "a testament to",
];

const DASH = /[–—]/;
const STAT = /\d+(\.\d+)?\s?%|\b\d+(\.\d+)?\s?(million|billion|crore|lakh)\b/i;
const SOURCE = /\]\(https?:\/\//;

// Drops link targets, inline code and URLs so their dots don't count as sentence ends
function visibleText(line) {
  return line
    .replace(/`[^`]*`/g, "")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/<https?:\/\/[^>]+>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^#+\s*/, "")
    .replace(/^([-*+]|\d+\.)\s+/, "")
    .replace(/^>\s*/, "");
}

function bannedIn(text) {
  const lower = text.toLowerCase();
  return BANNED.filter((phrase) => lower.includes(phrase));
}

export function countWords(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w)).length;
}

export function lintPost(meta, markdown) {
  const issues = [];
  const add = (rule, message, line = 0) => issues.push({ rule, message, line });

  const title = String(meta.title ?? "");
  const description = String(meta.description ?? "");
  const keyword = String(meta.keyword ?? "").trim().toLowerCase();

  if (!title || title.length > 65) add("title-length", `Title must be 1 to 65 characters (has ${title.length})`);
  if (description.length < 70 || description.length > 165) {
    add("description-length", `Description must be 70 to 165 characters (has ${description.length})`);
  }
  if (!meta.date || Number.isNaN(Date.parse(String(meta.date)))) add("date", "Frontmatter needs a valid date");
  if (!keyword) add("keyword", "Frontmatter needs a target keyword");
  else if (!keyword.split(/\s+/).every((w) => title.toLowerCase().includes(w))) {
    add("keyword", `Every word of the keyword "${keyword}" should appear in the title`);
  }

  for (const [field, value] of [["title", title], ["description", description]]) {
    if (DASH.test(value)) add("no-dash", `No em or en dashes in the ${field}`);
    for (const phrase of bannedIn(value)) add("banned-phrase", `"${phrase}" in the ${field}`);
  }

  let inCode = false;
  markdown.split("\n").forEach((raw, index) => {
    const line = raw.trim();
    const lineNo = index + 1;
    if (line.startsWith("```")) {
      inCode = !inCode;
      return;
    }
    if (inCode || !line || line.startsWith("<")) return;

    const text = visibleText(line);
    if (DASH.test(line)) add("no-dash", "No em or en dashes, use a comma or a new line", lineNo);
    if (/\.\s*$/.test(text) || /\.\s+\S/.test(text)) {
      add("no-period", "One sentence per line, without a full stop", lineNo);
    }
    for (const phrase of bannedIn(text)) add("banned-phrase", `"${phrase}" sounds like filler`, lineNo);
    if (STAT.test(text) && !SOURCE.test(line)) add("stat-needs-source", "Stats need a source link on the same line", lineNo);
  });

  const words = countWords(markdown);
  if (words < 600) add("min-words", `Posts need at least 600 words (has ${words})`);
  if (!/^##\s/m.test(markdown)) add("needs-h2", "Break the post into sections with ## headings");

  return issues;
}
