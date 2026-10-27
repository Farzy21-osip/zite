"use client";
import { useEffect, useState } from "react";
import Field from "./Field";
import { ME_FIELDS, SCHEMAS, SITE_FIELDS, TEXTS } from "./schema";
import { slug } from "../../lib/slug";
import "./admin.css";

const TABS = [["site", "Website texts"], ["me", "Me"], ["projects", "Projects"], ["achievements", "Achievements"], ["activity", "Activity"], ["papers", "Papers"], ["learning", "Learning Journey (on Papers)"]];

const load = (c) => fetch(`/api/admin?c=${c}`).then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error); return j; });
const save = (c, data) =>
  fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ c, data }) })
    .then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error); });

export default function AdminApp() {
  const [tab, setTab] = useState("site");
  const [box, setBox] = useState({ tab: "", data: null });
  const data = box.tab === tab ? box.data : null;
  const setData = (d) => setBox({ tab, data: d });
  const [sel, setSel] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState("");
  const schema = SCHEMAS[tab];
  const [all, setAll] = useState({});
  useEffect(() => {
    Promise.all(["projects", "achievements", "papers", "activity"].map((c) => load(c).then((d) => [c, d])))
      .then((r) => setAll(Object.fromEntries(r))).catch(() => {});
  }, []);
  const LABELS = { projects: "Project", achievements: "Award", papers: "Paper", activity: "Activity" };
  const linkOpts = [["", "Choose something to connect..."], ...Object.entries(LABELS).flatMap(([t, l]) => (all[t] ?? []).map((x) => [`${t}::${x.title}`, `${l}: ${x.title}`]))];

  useEffect(() => {
    setSel(0); setDirty(false); setMsg("");
    load(tab).then((d) => setBox({ tab, data: d })).catch((e) => setMsg("Could not load: " + e.message));
  }, [tab]);

  const go = (t) => { if (!dirty || confirm("You have unsaved changes. Leave without saving?")) setTab(t); };
  const edit = (d) => { setData(d); setDirty(true); setMsg(""); };
  const patch = (k, v) => {
    if (!schema) return edit({ ...data, [k]: v });
    const old = data[sel].title;
    edit(data.map((x, i) => (i === sel ? { ...x, [k]: v } : k === "title" && x.parent === old ? { ...x, parent: v } : x)));
  };
  // dropdowns whose choices depend on the other content
  const resolve = (f, item) => {
    if (f[3] === "@links") return [f[0], f[1], f[2], linkOpts, ...f.slice(4)];
    if (f[3] === "@parents") return [f[0], f[1], f[2], [["", "None (a main item)"], ...(data ?? []).filter((x) => !x.parent && x.title !== item.title).map((x) => [x.title, x.title])], ...f.slice(4)];
    if (f[2] === "list" && Array.isArray(f[3])) return [f[0], f[1], f[2], f[3].map((sf) => resolve(sf, item)), ...f.slice(4)];
    return f;
  };

  const doSave = async () => {
    if (schema) {
      const titles = data.map((x) => (x.title || "").trim());
      if (titles.some((t) => !t)) return setMsg("Not saved: every item needs a title.");
      if (new Set(titles.map(slug)).size !== titles.length) return setMsg("Not saved: two items have the same title.");
    }
    try { await save(tab, data); if (tab in LABELS) setAll((a) => ({ ...a, [tab]: data })); setDirty(false); setMsg("Saved. The site refreshes by itself in a second or two."); }
    catch (e) { setMsg("Not saved: " + e.message); }
  };
  const add = () => { edit([...data, schema.fresh()]); setSel(data.length); };
  const del = () => {
    if (!confirm(`Delete "${data[sel].title}"? You can still recover it from content/_backup after saving.`)) return;
    edit(data.filter((_, i) => i !== sel)); setSel(Math.max(0, sel - 1));
  };
  const move = (d) => {
    const j = sel + d;
    if (j < 0 || j >= data.length) return;
    const r = [...data]; [r[sel], r[j]] = [r[j], r[sel]]; edit(r); setSel(j);
  };
  const item = schema && data?.[sel];

  return (
    <div className="ad">
      <aside className="ad-side">
        <h1>Admin</h1>
        <p>Local only. Works while <code>npm run dev</code> is running.</p>
        {TABS.map(([k, l]) => <button key={k} className={k === tab ? "on" : ""} onClick={() => go(k)}>{l}</button>)}
        <a href="/" target="_blank">Open the site</a>
      </aside>
      <main className="ad-main">
        <div className="ad-top">
          <b>{TABS.find(([k]) => k === tab)[1]}</b>
          <span className="ad-msg" role="status">{msg || (dirty ? "Unsaved changes" : "")}</span>
          <button className="ad-save" disabled={!data || !dirty} onClick={doSave}>Save</button>
        </div>
        {!data && <p>{msg || "Loading..."}</p>}
        {data && tab === "me" && (
          <div className="ad-form">
            {ME_FIELDS.map((f) => <Field key={f[0]} f={f} value={data[f[0]]} onChange={(v) => patch(f[0], v)} />)}
            <p className="ad-hint">Tip: photos work best as square-ish images under 1 MB each.</p>
          </div>
        )}
        {data && tab === "site" && (
          <div className="ad-form">
            {SITE_FIELDS.map((f) => <Field key={f[0]} f={f} value={data[f[0]]} onChange={(v) => patch(f[0], v)} />)}
            <h2>Texts on the site</h2>
            {TEXTS.map(([k, l]) => <Field key={k} f={[k, l, "long"]} value={data.texts?.[k]} onChange={(v) => edit({ ...data, texts: { ...data.texts, [k]: v } })} />)}
          </div>
        )}
        {data && schema && (
          <div className="ad-split">
            <ul className="ad-items">
              {data.map((x, i) => <li key={i}><button className={i === sel ? "on" : ""} onClick={() => setSel(i)}>{x.title || "(untitled)"}</button></li>)}
              <li><button className="ad-add" onClick={add}>Add {schema.label.toLowerCase()}</button></li>
            </ul>
            <div className="ad-form" key={sel}>
              {item ? (
                <>
                  <div className="ad-bar">
                    <button onClick={() => move(-1)}>Move up</button>
                    <button onClick={() => move(1)}>Move down</button>
                    <button onClick={del}>Delete</button>
                    <a href={schema.page(slug(item.title || ""))} target="_blank">View on the site</a>
                  </div>
                  {schema.fields.map((f) => <Field key={f[0]} f={resolve(f, item)} value={item[f[0]]} onChange={(v) => patch(f[0], v)} />)}
                </>
              ) : <p>Nothing here yet. Add one.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
