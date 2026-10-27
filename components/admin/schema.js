// Describes the form for each kind of content.
// A field is [key, label, type, options, hint, when].  "when" = [otherKey, [values that show this field], defaultValue].
const DATE = ["date", "Date (for example 2026-03-12; filled from the file when you upload, so check it)", "text"];
const MEDIA = ["media", "Photos and videos", "list", [
  ["kind", "Type", "select", [["image", "Photo"], ["video", "Video"]]],
  ["src", "Photo, video file (MP4) or YouTube link", "file", "media"],
  ["poster", "Cover image for a video (optional)", "image", "media"],
  ["caption", "Caption", "text"],
  DATE,
]];
const DOCS = ["docs", "Documents and links", "list", [["title", "Title", "text"], ["kind", "Kind (PDF, Link, ...)", "text"], ["href", "File or web address", "file", "docs"]]];
const TXT = ["text", "quote", "stat", "list", "note"];
const STORY = ["story", "Description: write it your own way (add blocks and pick a type for each)", "list", [
  ["type", "Block type", "select", [["text", "Text with a title"], ["quote", "Quote"], ["stat", "Big number"], ["list", "Bullet list"], ["note", "Highlighted note"], ["image", "Image"], ["video", "Video"]]],
  ["h", "Title (for a Quote: who said it; for a Big number: the number, like 92%)", "text", null, null, ["type", TXT, "text"]],
  ["p", "Text (for a Bullet list: one item per line)", "long", null, null, ["type", TXT, "text"]],
  ["src", "Image, MP4 or YouTube link", "file", "media", null, ["type", ["image", "video"], "text"]],
  ["caption", "Caption", "text", null, null, ["type", ["image", "video"], "text"]],
  ["date", "Date of the image", "text", null, null, ["type", ["image"], "text"]],
  ["key", "Include in the 30-second version", "check"],
]];
const RELATED = ["related", "Connected to (shows as navigation on both sides)", "list", [["to", "Connect to", "select", "@links"]]];
const ART = [
  ["icon", "Icon image", "image", "icons"],
  ["bgColor", "Background color (optional)", "color"],
  ["bgColor2", "Second background color, for a gradient (optional)", "color"],
  ["bg", "Background image (optional, drawn over the colors)", "image", "designs"],
  ["bgDim", "Darken the background, 0 to 90 (default 60)", "number"],
  ["hue", "Placeholder color 0 to 360 (only used when there is no color or image)", "number"],
];
const year = () => String(new Date().getFullYear());

export const SITE_FIELDS = [
  ["first", "First name (muted, in the top bar)", "text"],
  ["main", "Main name (bold, in the top bar)", "text"],
  ["last", "Last name (muted, after the main name)", "text"],
  ["email", "Contact email", "text"],
];

export const TEXTS = [
  ["heroTitle", "Home: big headline"], ["heroLede", "Home: line under the headline"],
  ["projectsHome", "Home: Projects intro"], ["achievementsHome", "Home: Awards intro"],
  ["activityHome", "Home: Activity intro"], ["papersHome", "Home: Papers intro"],
  ["projectsPage", "Projects page: intro"], ["achievementsPage", "Achievements page: intro"],
  ["activityPage", "Activity page: intro"], ["papersPage", "Papers page: intro"],
  ["learningPage", "Papers page, Learning Journey section: intro"], ["cvNote", "Footer: CV line"],
];

export const ME_FIELDS = [
  ["portrait", "Your photo (top of the page, like a CV)", "image", "me"],
  ["role", "Role or title under your name (for example Student and maker)", "text"],
  ["headline", "One sentence about you", "text"],
  ["intro", "Introduction", "long"],
  ["facts", "At a glance (shown beside your photo)", "list", [["k", "Label (for example Based in)", "text"], ["v", "Value", "text"]]],
  ["links", "Links (GitHub, LinkedIn, ...)", "list", [["label", "Label", "text"], ["href", "Web address", "text"]]],
  ["orbitTitle", "Title in the middle of the photo orbit", "text"],
  ["photos", "Photos of me (they orbit on the Me page)", "list", [["src", "Image", "image", "me"], ["caption", "Caption", "text"], DATE]],
  ["sections", "The full explanation", "list", [["h", "Section title", "text"], ["p", "Text (blank lines start a new paragraph)", "long"]]],
];

export const SCHEMAS = {
  projects: {
    label: "Project", page: (s) => `/projects/${s}`,
    fresh: () => ({ kind: "hobby", title: "New project", year: year(), tags: [], blurb: "", summary: "", role: "", status: "", hue: 200, story: [], media: [], docs: [], related: [] }),
    fields: [
      ["title", "Title", "text", null, "Changing the title changes the page address."],
      ["parent", "Part of (choose a project to make this a sub-project inside it)", "select", "@parents"],
      ["kind", "Category", "select", [["school", "School and competition"], ["hobby", "Hobby"]]],
      ["year", "Year", "text"],
      DATE,
      ["tags", "Tags, separated by commas", "tags"],
      ["blurb", "Short description (shown in lists)", "long"],
      ["summary", "One-line summary (top of the project page)", "long"],
      ...ART,
      ["role", "Your role", "text"],
      ["status", "Status (Finished, Ongoing, ...)", "text"],
      MEDIA, STORY, RELATED, DOCS,
    ],
  },
  achievements: {
    label: "Achievement", page: (s) => `/achievements/${s}`,
    fresh: () => ({ type: "award", year: year(), title: "New award", comp: "", text: "", hue: 45, media: [], docs: [], story: [], related: [] }),
    fields: [
      ["title", "Title", "text", null, "Changing the title changes the page address."],
      ["parent", "Part of (choose an award to make this a sub-award inside it)", "select", "@parents"],
      ["type", "Kind", "select", [["award", "Award"], ["reflection", "Reflection"]]],
      ["year", "Year", "text"],
      DATE,
      ["comp", "Competition id (give an award and its reflection the same id, such as c1)", "text"],
      ["result", "Result (reflections only: Placed, Did not place, ...)", "text"],
      ["text", "Text", "long"],
      ["event", "Event and organizer", "text"],
      ...ART, MEDIA, STORY, RELATED, DOCS,
    ],
  },
  activity: {
    label: "Activity", page: () => "/activity",
    fresh: () => ({ kind: "organization", title: "New activity", org: "", role: "", period: "", year: year(), current: false, accent: "#FF8A3D", summary: "", highlights: [], media: [], link: "", related: [] }),
    fields: [
      ["title", "Title", "text", null, "Changing the title changes its link."],
      ["kind", "Kind", "select", [["organization", "Organization"], ["event", "Event"], ["volunteering", "Volunteering"], ["course", "Course or training"], ["community", "Community"]]],
      ["org", "Organization or host", "text"],
      ["role", "Your role", "text"],
      ["period", "Period (for example Jan 2024 - now)", "text"],
      ["year", "Year (groups and orders the page, newest first)", "text"],
      ["current", "Still ongoing", "check"],
      ["accent", "Accent color", "color"],
      ["summary", "What it is and what you did", "long"],
      ["highlights", "Highlights", "list", [["t", "Highlight", "text"]]],
      ["icon", "Logo or icon", "image", "icons"],
      MEDIA, RELATED,
      ["link", "Link", "text"],
    ],
  },
  papers: {
    label: "Paper", page: () => "/papers",
    fresh: () => ({ kind: "essay", title: "New paper", blurb: "", related: [] }),
    fields: [
      ["title", "Title", "text"],
      ["kind", "Group", "select", [["essay", "Research and essays"], ["idea", "Ideas & Philosophy"]]],
      ["status", "Level (only for Ideas & Philosophy)", "select", [["", "None"], ["Draft", "Draft"], ["Exploring", "Exploring"], ["Revised", "Revised"]]],
      ["blurb", "Short summary", "long"],
      RELATED,
    ],
  },
  learning: {
    label: "Note", page: () => "/papers",
    fresh: () => ({ kind: "explained", title: "New note", blurb: "" }),
    fields: [
      ["title", "Title", "text"],
      ["kind", "Group", "select", [["explained", "Explained simply"], ["doodle", "Math doodle"]]],
      ["blurb", "Short description", "long"],
    ],
  },
};
