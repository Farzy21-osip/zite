import fs from "node:fs/promises";
import path from "node:path";
import { guard } from "../../../../lib/adminGuard";

const FOLDERS = ["icons", "designs", "media", "docs", "me"];
const EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".pdf", ".mp4"];
const err = (error, status = 400) => Response.json({ error }, { status });

export async function POST(req) {
  const bad = guard(req);
  if (bad) return bad;
  const fd = await req.formData();
  const file = fd.get("file");
  const folder = fd.get("folder");
  if (!file || typeof file === "string" || !FOLDERS.includes(folder)) return err("Bad upload");
  const ext = path.extname(file.name).toLowerCase();
  if (!EXT.includes(ext)) return err(`File type ${ext || "(none)"} is not allowed`);
  if (file.size > 30e6) return err("File is over 30 MB");
  const base = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "file";
  const dir = path.join(process.cwd(), "public", folder);
  await fs.mkdir(dir, { recursive: true });
  let name = base + ext, n = 1;
  while (await fs.access(path.join(dir, name)).then(() => true, () => false)) name = `${base}-${++n}${ext}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ path: `/${folder}/${name}` });
}
