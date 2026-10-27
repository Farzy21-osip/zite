import fs from "node:fs";
import path from "node:path";

// All content lives in /content/*.json. Edit it with the local admin at /admin (run "npm run dev").
// It is read from disk on every render in dev, so saves in the admin show up straight away,
// and once at build time in production.
const read = (name) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", `${name}.json`), "utf8"));

export const content = () => ({
  site: read("site"),
  projects: read("projects"),
  achievements: read("achievements"),
  papers: read("papers"),
  learning: read("learning"),
});
