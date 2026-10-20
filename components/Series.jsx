"use client";
import { useRef, useState } from "react";
import Chips from "./Chips";

const cap = (s) => s[0].toUpperCase() + s.slice(1);

export default function Series({ items }) {
  const box = useRef(null);
  const [f, setF] = useState("all");
  const [cur, setCur] = useState(null);
  const kinds = ["all", ...new Set(items.map((x) => x.kind))];
  return (
    <section className="series">
      <h2 className="sub">{items.length} pieces in this project</h2>
      <Chips opts={kinds.map((k) => [k, k === "all" ? "All" : cap(k)])} val={f} set={setF} />
      <ul className="rows">
        {items.filter((x) => f === "all" || x.kind === f).map((x) => (
          <li key={x.title}>
            <a href="#" onClick={(e) => { e.preventDefault(); setCur(x); box.current.showModal(); }}>
              <b>{x.title}</b><em>{cap(x.kind)}</em><span>{x.date} / {x.platform}</span>
            </a>
          </li>
        ))}
      </ul>
      <dialog ref={box} className="lightbox" onClick={(e) => e.target === box.current && box.current.close()}>
        {cur && (<><h3 className="pt" style={{ color: "var(--ink)" }}>{cur.title}</h3><p>{cur.text}</p><a className="more" href={cur.href}>Open the original on {cur.platform}</a></>)}
        <div className="lbbar"><button onClick={() => box.current.close()}>Close</button></div>
      </dialog>
    </section>
  );
}
