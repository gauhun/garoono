// Publishes a paid doc: renders its covers from page 1, renders the free 30% preview,
// and uploads the PDF to the private bucket. macOS only (uses sips). Usage: npm run add-doc -- <file.pdf> <slug>
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

const [pdf, slug] = process.argv.slice(2);
const BUCKET = "gs://baseproject-25dbe-paid-docs";
const ACCOUNT = "garoonotech@gmail.com";

if (!pdf || !slug) {
  console.error("Usage: npm run add-doc -- <file.pdf> <slug>");
  process.exit(1);
}
if (!/^[a-z0-9-]{3,60}$/.test(slug)) {
  console.error("Slug must match ^[a-z0-9-]{3,60}$");
  process.exit(1);
}
if (!existsSync(pdf)) {
  console.error(`Not found: ${pdf}`);
  process.exit(1);
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit" });

for (const [suffix, width] of [["", "600"], ["-sm", "64"]]) {
  run("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "80", "--resampleWidth", width, pdf, "--out", `public/doc-covers/${slug}${suffix}.jpg`]);
}

run("node", ["scripts/web-images.mjs"]);

mkdirSync("private-docs/paid", { recursive: true });
copyFileSync(pdf, `private-docs/paid/${slug}.pdf`);
run("node", ["scripts/doc-previews.mjs", "--force", slug]);

run("gcloud", ["storage", "cp", pdf, `${BUCKET}/${slug}.pdf`, "--content-type=application/pdf", `--account=${ACCOUNT}`]);

console.log(`
Uploaded. Add this to the top of docs in src/data/docs.ts:

  {
    slug: "${slug}",
    title: "",
    blurb: "",
    free: false,
    addedOn: "${new Date().toISOString().slice(0, 10)}",
  },
`);
