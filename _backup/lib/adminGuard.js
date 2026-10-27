// The admin API can write files, so it only answers while running "npm run dev", on this computer, from our own pages.
export function guard(req) {
  const no = (error, status) => Response.json({ error }, { status });
  if (process.env.NODE_ENV !== "development") return no("The admin only works with npm run dev.", 404);
  const host = req.headers.get("host") || "";
  let name = "";
  try { name = new URL("http://" + host).hostname; } catch {}
  if (!["localhost", "127.0.0.1", "[::1]"].includes(name)) return no("Local access only.", 403);
  if (req.method !== "GET") {
    const origin = req.headers.get("origin");
    let same = false;
    try { same = !!origin && new URL(origin).host === host; } catch {}
    if (!same) return no("Request did not come from the admin page.", 403);
  }
  return null;
}
