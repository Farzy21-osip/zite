// Small helpers shared by server and client components.
export const yt = (u = "") => (u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/) || [])[1];
export const isVideo = (m = {}) => m.kind === "video" || !!yt(m.src) || /\.(mp4|webm)$/i.test(m.src || "");
export const poster = (m = {}) => m.poster || (yt(m.src) ? `https://img.youtube.com/vi/${yt(m.src)}/hqdefault.jpg` : "");
// "2026-03-12" becomes "12 Mar 2026"; anything else you typed is shown as it is.
export const fmtDate = (d) => {
  if (!d) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  if (!m) return d;
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
// One picture that stands for an item: its icon, or its first photo or video cover.
export const previewOf = (it = {}) => it.icon || (it.media || []).map((m) => (isVideo(m) ? poster(m) : m.src)).find(Boolean) || it.portrait || "";
