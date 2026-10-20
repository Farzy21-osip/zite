// Placeholder content. Replace with your real work.
export const site = { name: "Rizky Zilant", first: "Rizky", main: "Zilant", email: "you@example.com" };
const B = "One line on the problem and what you built.";
const R = "What went well, what I got wrong, and what I would change.";
const A = "Competition name, what it was for, and what it meant to me.";
const P = "A short summary of the question and where it stands.";
export const projects = [
  { kind: "school", title: "Sample project A", icon: "/icons/sample-project-a.svg", hue: 38, blurb: B, tags: ["Robotics", "Arduino"], year: "2026" },
  { kind: "school", title: "Sample project B", icon: "/icons/sample-project-b.svg", hue: 200, blurb: B, tags: ["Physics", "Competition"], year: "2025" },
  { kind: "hobby", title: "Sample project C", icon: "/icons/sample-project-c.svg", hue: 165, blurb: B, tags: ["Electronics", "ESP32"], year: "2026" },
  { kind: "hobby", title: "Sample project D", icon: "/icons/sample-project-d.svg", hue: 280, blurb: B, tags: ["Software", "Raspberry Pi"], year: "2025" },
];
export const achievements = [
  { type: "award", year: "2026", title: "Sample award 1", comp: "c1", icon: "/icons/sample-award-1.svg", hue: 45, text: A },
  { type: "reflection", year: "2026", title: "Sample competition 1", comp: "c1", result: "Placed", text: R },
  { type: "award", year: "2025", title: "Sample award 2", comp: "c2", icon: "/icons/sample-award-2.svg", hue: 330, text: A },
  { type: "reflection", year: "2025", title: "Sample competition 2", comp: "c2", result: "Did not place", text: R },
];
export const papers = [
  { kind: "idea", status: "Exploring", title: "Sample hypothesis", blurb: P },
  { kind: "idea", status: "Draft", title: "Sample math model", blurb: P },
  { kind: "essay", title: "Sample essay", blurb: P },
  { kind: "essay", title: "Sample research paper", blurb: P },
  { kind: "idea", status: "Draft", title: "Sample social philosophy piece", blurb: P },
];
export const learning = [
  { kind: "explained", title: "Sample: how a magnet works", blurb: "A physics idea explained for a child, with drawings." },
  { kind: "explained", title: "Sample: why the sky is blue", blurb: "A physics idea explained for a child, with drawings." },
  { kind: "doodle", title: "Sample doodle A", blurb: "A short visual play with a mathematical idea." },
  { kind: "doodle", title: "Sample doodle B", blurb: "A short visual play with a mathematical idea." },
];

// ---- detail-page content (placeholder: replace with your real material) ----
const STORY = [
  { h: "The question", p: "What I wanted to understand, in a few plain sentences.", key: true },
  { h: "What I tried", p: "How I approached it: the build or the method." },
  { h: "What happened", p: "The result, with real numbers if there are any.", key: true },
  { h: "What went wrong", p: "What failed, and what it taught me." },
  { h: "What I learned", p: "What I understand now that I did not before." },
  { h: "Next", p: "What I would explore or improve next." },
];
const MEDIA = [1, 2, 3].map((n) => ({ src: `/media/sample-${n}.svg`, caption: `Sample photo ${n}: describe what the picture shows.` }));
for (const p of projects) {
  Object.assign(p, { ...{ summary: "One sentence on what this is and why it matters to me.", role: "Builder", status: "Finished", story: STORY, media: MEDIA,
    docs: [{ title: "Project report (PDF)", kind: "PDF", href: "#" }, { title: "Code on GitHub", kind: "Link", href: "#" }] }, ...p });
}
for (const a of achievements) {
  Object.assign(a, { ...{ event: "Event name and organizer", media: MEDIA,
    docs: [{ title: "Certificate (PDF)", kind: "PDF", href: "#" }, { title: "Entry paper (PDF)", kind: "PDF", href: "#" }] }, ...a });
}
// A project made of many pieces, like content-making
const pieces = [["Sample piece 1", "video", "Mar 2026", "YouTube"], ["Sample piece 2", "video", "Feb 2026", "YouTube"], ["Sample piece 3", "post", "Jan 2026", "Instagram"], ["Sample piece 4", "article", "Dec 2025", "Blog"], ["Sample piece 5", "post", "Nov 2025", "Instagram"]];
Object.assign(projects.find((p) => p.title === "Sample project D"), {
  type: "series",
  items: pieces.map(([title, kind, date, platform]) => ({ title, kind, date, platform, text: "A short note on what this piece is and what I learned making it.", href: "#" })),
});
