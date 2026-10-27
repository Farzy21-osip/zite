import fs from "node:fs";
import path from "node:path";
import { slug } from "./slug";
import { previewOf } from "./media";

// All content lives in /content/*.json. Edit it with the local admin at /admin (run "npm run dev").
// It is read from disk on every render in dev, so saves in the admin show up straight away,
// and once at build time in production.
const read = (name, fallback) => {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", `${name}.json`), "utf8")); }
  catch { return fallback; }
};

export const TEXTS = {
  heroTitle: "I build things and write down how they work.",
  heroLede: "Electronics, code and physics: projects, competitions and the notes behind them.",
  projectsHome: "Built for school, competitions and fun.",
  achievementsHome: "Plus a reflection for every competition.",
  activityHome: "Organizations, events and things I have done beyond class.",
  papersHome: "Longer pieces of research and writing.",
  projectsPage: "Hover or tab through a project: its icon pops up and the screen takes on its design.",
  achievementsPage: "What I won, and the competition behind each one.",
  activityPage: "Where I have been involved, and what I did there.",
  papersPage: "Longer pieces of research and writing.",
  learningPage: "Understanding things that already exist in nature, and writing them down so others can too.",
  cvNote: "A link to download my CV (PDF) will go here.",
};
const ME = { headline: "", intro: "", role: "", portrait: "", orbitTitle: "Moments", links: [], photos: [], facts: [], sections: [] };

// Missing files and missing fields fall back to defaults, so older content keeps working after an update.
export const content = () => {
  const site = read("site", {});
  return {
    site: { first: "Rizky", main: "Zilant", last: "Fattah", email: "you@example.com", ...site, texts: { ...TEXTS, ...site.texts } },
    me: { ...ME, ...read("me", {}) },
    projects: read("projects", []),
    achievements: read("achievements", []),
    papers: read("papers", []),
    learning: read("learning", []),
    activity: read("activity", []),
  };
};

export const fullName = (s) => [s.first, s.main, s.last].filter(Boolean).join(" ");

// ---- structure helpers ----
// A sub-project (or sub-award) has a "parent" with the title of its main item.
export const topLevel = (items) => items.filter((p) => !p.parent || !items.some((x) => x.title === p.parent));
export const childrenOf = (items, p) => items.filter((x) => x.parent === p.title);

// Connections ("related") are written once, on either side, and show up on both.
const LABEL = { projects: "Project", achievements: "Award", papers: "Paper", activity: "Activity" };
const hrefOf = (t, title) => ({ projects: `/projects/${slug(title)}`, achievements: `/achievements/${slug(title)}`, papers: `/papers#${slug(title)}`, activity: `/activity#${slug(title)}` })[t];

export function relatedFor(all, type, item) {
  const out = [], seen = new Set();
  const add = (t, it) => {
    const k = `${t}::${it.title}`;
    if (seen.has(k) || (t === type && it.title === item.title)) return;
    seen.add(k);
    out.push({ label: LABEL[t], title: it.title, href: hrefOf(t, it.title), image: previewOf(it) });
  };
  for (const l of item.related ?? []) {
    const [t, title] = (l.to || "").split("::");
    const it = (all[t] ?? []).find((x) => x.title === title);
    if (it) add(t, it);
  }
  for (const t of Object.keys(LABEL)) {
    for (const it of all[t] ?? []) if ((it.related ?? []).some((l) => l.to === `${type}::${item.title}`)) add(t, it);
  }
  return out;
}
