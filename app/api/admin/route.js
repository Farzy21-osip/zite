import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { guard } from "../../../lib/adminGuard";
import { content } from "../../../lib/data";

const DIR = path.join(process.cwd(), "content");
const OK = ["site", "me", "projects", "achievements", "papers", "learning", "activity"];
const OBJECTS = ["site", "me"];
const err = (error, status = 400) => Response.json({ error }, { status });

export async function GET(req) {
  const bad = guard(req);
  if (bad) return bad;
  const c = new URL(req.url).searchParams.get("c");
  if (!OK.includes(c)) return err("Unknown collection");
  return Response.json(content()[c]); // includes defaults for anything not saved yet
}

export async function POST(req) {
  const bad = guard(req);
  if (bad) return bad;
  const { c, data } = await req.json();
  if (!OK.includes(c)) return err("Unknown collection");
  if (OBJECTS.includes(c) === Array.isArray(data)) return err("Wrong data shape");
  const file = path.join(DIR, `${c}.json`);
  // keep the 10 most recent versions of each file, in content/_backup
  const bdir = path.join(DIR, "_backup");
  await fs.mkdir(bdir, { recursive: true });
  try { await fs.copyFile(file, path.join(bdir, `${c}.${new Date().toISOString().replace(/[:.]/g, "-")}.json`)); } catch {}
  const old = (await fs.readdir(bdir)).filter((n) => n.startsWith(c + ".")).sort();
  for (const n of old.slice(0, -10)) await fs.unlink(path.join(bdir, n));
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n");
  revalidatePath("/", "layout"); // drop cached pages so the site shows the new content
  return Response.json({ ok: true });
}
