"use client";
import { useEffect, useState } from "react";
import Field from "./Field";
import { SCHEMAS, SITE_FIELDS, TEXTS } from "./schema";
import { slug } from "../../lib/slug";
import "./admin.css";

const TABS = [["site", "Website texts"], ["projects", "Projects"], ["achievements", "Achievements"], ["papers", "Papers"], ["learning", "Learning Journey"]];

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

  useEffect(() => {
    setSel(0); setDirty(false); setMsg("");
    load(tab).then((d) => setBox({ tab, data: d })).catch((e) => setMsg("Could not load: " + e.message));
  }, [tab]);

  const go = (t) => { if (!dirty || confirm("You have unsaved changes. Leave without saving?")) setTab(t); };
  const edit = (d) => { setData(d); setDirty(true); setMsg(""); };
  const patch = (k, v) => edit(schema ? data.map((x, i) => (i === sel ? { ...x, [k]: v } : x)) : { ...data, [k]: v });

  const doSave = async () => {
    if (schema) {
      const titles = data.map((x) => (x.title || "").trim());
      if (titles.some((t) => !t)) return setMsg("Not saved: every item needs a title.");
      if (new Set(titles.map(slug)).size !== titles.length) return setMsg("Not saved: two items have the same title.");
    }
    try { await save(tab, data); setDirty(false); setMsg("Saved. The site refreshes by itself in a second or two."); }
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
        {data && !schema && (
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
                  {schema.fields.map((f) => <Field key={f[0]} f={f} value={item[f[0]]} onChange={(v) => patch(f[0], v)} />)}
                </>
              ) : <p>Nothing here yet. Add one.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
