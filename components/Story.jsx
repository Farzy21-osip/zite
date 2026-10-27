"use client";
import { useEffect, useState } from "react";
import Chips from "./Chips";
import { slug } from "../lib/slug";
import { fmtDate, yt } from "../lib/media";

// The description is a list of blocks you choose yourself:
// text, quote, big number, bullet list, highlighted note, image or video.
const RAIL = ["text", "list", "note"];
const titled = (c) => RAIL.includes(c.type || "text") && c.h;

function Block({ c }) {
  const t = c.type || "text";
  if (t === "quote") return <blockquote><p>{c.p}</p>{c.h && <cite>{c.h}</cite>}</blockquote>;
  if (t === "stat") return <div><b>{c.h}</b><span>{c.p}</span></div>;
  if (t === "list") return <>{c.h && <h2>{c.h}</h2>}<ul>{(c.p || "").split("\n").filter(Boolean).map((x, i) => <li key={i}>{x}</li>)}</ul></>;
  if (t === "note") return <aside>{c.h && <b>{c.h}</b>}<p>{c.p}</p></aside>;
  if (t === "image") return <figure><img src={c.src} alt={c.caption || ""} />{(c.caption || c.date) && <figcaption>{c.date && <time>{fmtDate(c.date)}</time>}{c.date && c.caption ? " · " : ""}{c.caption}</figcaption>}</figure>;
  if (t === "video") {
    const id = yt(c.src);
    return <figure>{id ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={c.caption || "Video"} allowFullScreen /> : c.src ? <video src={c.src} controls playsInline /> : null}{c.caption && <figcaption>{c.caption}</figcaption>}</figure>;
  }
  return <>{c.h && <h2>{c.h}</h2>}<p>{c.p}</p></>;
}

export default function Story({ chapters }) {
  const [full, setFull] = useState(false);
  const [on, setOn] = useState(null);
  const short = chapters.some((c) => c.key) ? chapters.filter((c) => c.key) : chapters.slice(0, 2);
  const list = full ? chapters : short;
  const heads = list.filter(titled);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll(".chapter[id]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [full]);
  return (
    <section className="story">
      {chapters.length > short.length && <Chips opts={[["short", "30-second version"], ["full", "Full story"]]} val={full ? "full" : "short"} set={(k) => setFull(k === "full")} />}
      <div className="storygrid">
        {full && heads.length > 0
          ? <ol className="rail">{heads.map((c) => <li key={c.h}><a href={`#${slug(c.h)}`} data-on={on === slug(c.h) ? "" : undefined}>{c.h}</a></li>)}</ol>
          : <span />}
        <div>
          {list.map((c, i) => (
            <article key={i} id={titled(c) ? slug(c.h) : undefined} className={`chapter blk-${c.type || "text"}`}><Block c={c} /></article>
          ))}
        </div>
      </div>
    </section>
  );
}
