"use client";
import { useEffect, useState } from "react";
import Chips from "./Chips";
import { slug } from "../lib/slug";

export default function Story({ chapters }) {
  const [full, setFull] = useState(false);
  const [on, setOn] = useState(null);
  const short = chapters.some((c) => c.key) ? chapters.filter((c) => c.key) : chapters.slice(0, 2);
  const list = full ? chapters : short;
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll(".chapter").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [full]);
  return (
    <section className="story">
      <Chips opts={[["short", "30-second version"], ["full", "Full story"]]} val={full ? "full" : "short"} set={(k) => setFull(k === "full")} />
      <div className="storygrid">
        {full ? (
          <ol className="rail">
            {list.map((c) => <li key={c.h}><a href={`#${slug(c.h)}`} data-on={on === slug(c.h) ? "" : undefined}>{c.h}</a></li>)}
          </ol>
        ) : <span />}
        <div>
          {list.map((c) => <article key={c.h} id={slug(c.h)} className="chapter"><h2>{c.h}</h2><p>{c.p}</p></article>)}
        </div>
      </div>
    </section>
  );
}
