// Describes the form for each kind of content. A field is [key, label, type, options, hint].
const MEDIA = ["media", "Photos", "list", [["src", "Image", "image", "media"], ["caption", "Caption", "text"]]];
const DOCS = ["docs", "Documents and links", "list", [["title", "Title", "text"], ["kind", "Kind (PDF, Link, ...)", "text"], ["href", "File or web address", "file", "docs"]]];
const ART = [
  ["icon", "Icon image", "image", "icons"],
  ["bg", "Background design image (optional)", "image", "designs", "Shown behind the page. Without one, a colored placeholder is used."],
  ["hue", "Placeholder color, 0 to 360 (used when there is no design image)", "number"],
];
const year = () => String(new Date().getFullYear());

export const SITE_FIELDS = [
  ["name", "Full name (browser tab title)", "text"],
  ["first", "First name (muted, in the top bar)", "text"],
  ["main", "Main name (bold, in the top bar)", "text"],
  ["email", "Contact email", "text"],
];

export const TEXTS = [
  ["heroTitle", "Home: big headline"], ["heroLede", "Home: line under the headline"],
  ["projectsHome", "Home: Projects intro"], ["achievementsHome", "Home: Awards intro"],
  ["learningHome", "Home: Learning Journey intro"], ["papersHome", "Home: Papers intro"],
  ["projectsPage", "Projects page: intro"], ["achievementsPage", "Achievements page: intro"],
  ["learningPage", "Learning Journey page: intro"], ["papersPage", "Papers page: intro"],
  ["cvNote", "Footer: CV line"],
];

export const SCHEMAS = {
  projects: {
    label: "Project", page: (s) => `/projects/${s}`,
    fresh: () => ({ kind: "hobby", type: "single", title: "New project", year: year(), tags: [], blurb: "", summary: "", role: "", status: "", hue: 200, story: [], media: [], docs: [] }),
    fields: [
      ["title", "Title", "text", null, "Changing the title changes the page address."],
      ["kind", "Category", "select", [["school", "School and competition"], ["hobby", "Hobby"]]],
      ["year", "Year", "text"],
      ["tags", "Tags, separated by commas", "tags"],
      ["blurb", "Short description (shown in lists)", "long"],
      ["summary", "One-line summary (top of the project page)", "long"],
      ...ART,
      ["role", "Your role", "text"],
      ["status", "Status (Finished, Ongoing, ...)", "text"],
      ["type", "Project type", "select", [["single", "Single project"], ["series", "Series of many pieces"]]],
      ["story", "Story chapters", "list", [["h", "Chapter title", "text"], ["p", "Text", "long"], ["key", "Include in the 30-second version", "check"]]],
      MEDIA, DOCS,
      ["items", "Pieces (only for series projects)", "list", [["title", "Title", "text"], ["kind", "Kind (video, post, article, ...)", "text"], ["date", "Date", "text"], ["platform", "Platform", "text"], ["text", "Note", "long"], ["href", "Link", "text"]]],
    ],
  },
  achievements: {
    label: "Achievement", page: (s) => `/achievements/${s}`,
    fresh: () => ({ type: "award", year: year(), title: "New award", comp: "", text: "", hue: 45, media: [], docs: [] }),
    fields: [
      ["title", "Title", "text", null, "Changing the title changes the page address."],
      ["type", "Kind", "select", [["award", "Award"], ["reflection", "Reflection"]]],
      ["year", "Year", "text"],
      ["comp", "Competition id (give an award and its reflection the same id, such as c1)", "text"],
      ["result", "Result (reflections only: Placed, Did not place, ...)", "text"],
      ["text", "Text", "long"],
      ["event", "Event and organizer", "text"],
      ...ART, MEDIA, DOCS,
    ],
  },
  papers: {
    label: "Paper", page: () => "/papers",
    fresh: () => ({ kind: "essay", title: "New paper", blurb: "" }),
    fields: [
      ["title", "Title", "text"],
      ["kind", "Group", "select", [["essay", "Research and essays"], ["idea", "Ideas & Philosophy"]]],
      ["status", "Level (only for Ideas & Philosophy)", "select", [["", "None"], ["Draft", "Draft"], ["Exploring", "Exploring"], ["Revised", "Revised"]]],
      ["blurb", "Short summary", "long"],
    ],
  },
  learning: {
    label: "Note", page: () => "/learning",
    fresh: () => ({ kind: "explained", title: "New note", blurb: "" }),
    fields: [
      ["title", "Title", "text"],
      ["kind", "Group", "select", [["explained", "Explained simply"], ["doodle", "Math doodle"]]],
      ["blurb", "Short description", "long"],
    ],
  },
};
