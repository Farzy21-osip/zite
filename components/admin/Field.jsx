"use client";
import { useState } from "react";

async function send(file, folder) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Upload failed");
  return j.path;
}

export default function Field({ f, value, onChange, row, setRow }) {
  const [, label, type, opt, hint] = f;
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (type === "list") {
    const rows = value ?? [];
    const swap = (i, d) => {
      const j = i + d;
      if (j < 0 || j >= rows.length) return;
      const r = [...rows];
      [r[i], r[j]] = [r[j], r[i]];
      onChange(r);
    };
    return (
      <fieldset className="ad-list">
        <legend>{label}</legend>
        {rows.map((row, i) => (
          <div className="ad-row" key={i}>
            <div className="ad-bar">
              <b>{i + 1}</b>
              <button type="button" onClick={() => swap(i, -1)}>Up</button>
              <button type="button" onClick={() => swap(i, 1)}>Down</button>
              <button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))}>Remove</button>
            </div>
            {opt.filter((sf) => !sf[5] || sf[5][1].includes(row[sf[5][0]] ?? sf[5][2])).map((sf) => (
              <Field key={sf[0]} f={sf} value={row[sf[0]]} row={row}
                onChange={(v) => onChange(rows.map((r, j) => (j === i ? { ...r, [sf[0]]: v } : r)))}
                setRow={(patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))} />
            ))}
          </div>
        ))}
        <button type="button" className="ad-add" onClick={() => onChange([...rows, {}])}>Add</button>
      </fieldset>
    );
  }

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const path = await send(file, opt);
      // a photo gets its date from the file's own date (you can still change it)
      if (setRow) setRow({ [f[0]]: path, ...(f[0] === "src" && !row?.date && file.lastModified ? { date: new Date(file.lastModified).toISOString().slice(0, 10) } : {}) });
      else onChange(path);
    } catch (x) { setErr(x.message); }
    setBusy(false);
  };
  const v = value ?? "";
  return (
    <label className={`ad-field${type === "check" ? " ad-check" : ""}`}>
      <span>{label}</span>
      {type === "text" && <input value={v} onChange={(e) => onChange(e.target.value)} />}
      {type === "long" && <textarea rows={3} value={v} onChange={(e) => onChange(e.target.value)} />}
      {type === "number" && <input type="number" value={v} onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))} />}
      {type === "color" && (
        <div className="ad-color">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(v) ? v : "#000000"} onChange={(e) => onChange(e.target.value)} />
          <input value={v} placeholder="none" onChange={(e) => onChange(e.target.value)} />
          {v && <button type="button" onClick={() => onChange("")}>Clear</button>}
        </div>
      )}
      {type === "check" && <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />}
      {type === "select" && (
        <select value={v || opt[0][0]} onChange={(e) => onChange(e.target.value)}>
          {opt.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      )}
      {type === "tags" && (
        <input defaultValue={(value ?? []).join(", ")} onBlur={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
      )}
      {(type === "image" || type === "file") && (
        <div className="ad-up">
          {type === "image" && v && <img src={v} alt="" />}
          <input value={v} placeholder="/folder/file.png or a web address" onChange={(e) => onChange(e.target.value)} />
          <input type="file" disabled={busy} onChange={pick} />
          {busy && <em>Uploading...</em>}
        </div>
      )}
      {hint && <small>{hint}</small>}
      {err && <small className="ad-err">{err}</small>}
    </label>
  );
}
