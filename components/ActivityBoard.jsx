"use client";
import { useState } from "react";
import { slug } from "../lib/slug";
import { RelGrid } from "./Related";

const KINDS = { organization: "Organizations", event: "Events", volunteering: "Volunteering", course: "Courses", community: "Community" };
const ONE = { organization: "Organization", event: "Event", volunteering: "Volunteering", course: "Course", community: "Community" };

export default function ActivityBoard({ items }) {
  const [f, setF] = useState("all");
  const kinds = ["all", ...Object.keys(KINDS).filter((k) => items.some((x) => x.kind === k))];
  const list = items.filter((x) => f === "all" || x.kind === f);
  const key = (x) => x.year || "Earlier";
  const years = [...new Set(list.map(key))].sort((a, b) => (a === "Earlier") - (b === "Earlier") || String(b).localeCompare(String(a)));
  const glow = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px");
    e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px");
  };
  const orgs = items.filter((x) => x.kind === "organization").length;

  return (
    <>
      <p className="act-stats"><b>{items.length}</b> things done, <b>{orgs}</b> organizations</p>
      <div className="act-chips">
        {kinds.map((k) => <button key={k} aria-pressed={f === k} onClick={() => setF(k)}>{k === "all" ? "Everything" : KINDS[k]}</button>)}
      </div>
      {years.map((y) => (
        <section key={y} className="yr-block">
          <h2 className="act-year">{y}</h2>
          <ul className="stops">
            {list.filter((x) => key(x) === y).map((x) => (
              <li key={x.title} id={slug(x.title)} className="stop" data-kind={x.kind} style={{ "--ac": x.accent || "#FF8A3D" }} onPointerMove={glow}>
                <details>
                  <summary>
                    {x.icon ? <img className="stop-ico" src={x.icon} alt="" /> : <span className="stop-dot" />}
                    <span className="stop-main"><b>{x.title}</b><i>{[x.role, x.org].filter(Boolean).join(" at ")}</i></span>
                    <span className="stop-meta"><em>{ONE[x.kind] ?? x.kind}</em>{x.current && <u>Now</u>}<small>{x.period}</small></span>
                  </summary>
                  <div className="stop-body">
                    {x.summary && <p>{x.summary}</p>}
                    {x.highlights?.length > 0 && <ul className="hl">{x.highlights.map((h, i) => <li key={i}>{h.t}</li>)}</ul>}
                    {x.media?.some((m) => m.src) && <div className="stop-pics">{x.media.filter((m) => m.src).map((m, i) => <img key={i} src={m.poster || m.src} alt={m.caption || ""} />)}</div>}
                    {x.link && <a className="act-link" href={x.link}>Learn more</a>}
                    {x.rel?.length > 0 && <div className="rel-compact"><RelGrid items={x.rel} /></div>}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
