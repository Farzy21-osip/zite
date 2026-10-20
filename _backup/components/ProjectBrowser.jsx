"use client";
import { useEffect, useState } from "react";
import { slug } from "../lib/slug";
import Chips from "./Chips";

const label = { school: "School and competition", hobby: "Hobby" };

export default function ProjectBrowser({ items }) {
  const [f, setF] = useState("all");
  const [i, setI] = useState(0);
  useEffect(() => {
    const n = items.findIndex((p) => "#" + slug(p.title) === decodeURIComponent(location.hash));
    if (n > -1) setI(n);
  }, [items]);
  const list = items.filter((p) => f === "all" || p.kind === f);
  const cur = list[Math.min(i, list.length - 1)];
  return (
    <>
      <Chips opts={[["all", "All"], ["school", label.school], ["hobby", label.hobby]]} val={f} set={(k) => { setF(k); setI(0); }} />
      <div className="split">
        <ul className="rows">
          {list.map((p, n) => (
            <li key={p.title} id={slug(p.title)} data-pop={slug(p.title)}>
              <a href="#" data-on={n === i ? "" : undefined} onClick={(e) => e.preventDefault()} onMouseEnter={() => setI(n)} onFocus={() => setI(n)}>
                <b>{p.icon && <img className="ico" src={p.icon} alt="" />}{p.title}</b><em>{p.year}</em><span>{p.blurb}</span>
              </a>
              {p.icon && <img className="pop" src={p.icon} alt="" />}
            </li>
          ))}
        </ul>
        {cur && (
          <aside className="panel" data-k={cur.kind}>
            <div className="viz" />
            {cur.icon && <img className="picon" src={cur.icon} alt="" />}
            <div className="pbody">
              <h3>{label[cur.kind]}</h3>
              <p className="pt">{cur.title}</p>
              <p>{cur.blurb}</p>
              <p className="tags">{cur.tags.join("  /  ")}</p>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
