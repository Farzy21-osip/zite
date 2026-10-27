"use client";
import { useRef, useState } from "react";
import { fmtDate, isVideo, poster, yt } from "../lib/media";

// Photos and videos, each with its date. A video can be an uploaded MP4 or a YouTube link.
const tilt = (amount) => (e) => {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", (x - 0.5) * amount + "deg");
  el.style.setProperty("--rx", (0.5 - y) * amount + "deg");
  el.style.setProperty("--gx", x * 100 + "%");
  el.style.setProperty("--gy", y * 100 + "%");
};
const flat = (e) => { e.currentTarget.style.setProperty("--ry", "0deg"); e.currentTarget.style.setProperty("--rx", "0deg"); };

function Thumb({ m }) {
  const p = poster(m);
  if (!isVideo(m)) return <img src={m.src} alt={m.caption || ""} />;
  if (p) return <><img src={p} alt={m.caption || ""} /><i className="play" /></>;
  if (m.src && !yt(m.src)) return <><video src={`${m.src}#t=0.1`} muted playsInline preload="metadata" /><i className="play" /></>;
  return <><span className="novid">Video</span><i className="play" /></>;
}

export default function Gallery({ items, title = "Photos and videos" }) {
  const box = useRef(null);
  const [i, setI] = useState(0);
  const [on, setOn] = useState(false);
  const list = (items ?? []).filter((m) => m.src || m.poster);
  if (!list.length) return null;
  const m = list[i] ?? list[0];
  const open = (n) => { setI(n); setOn(true); box.current.showModal(); };
  const step = (d) => setI((i + d + list.length) % list.length);
  const id = yt(m.src);
  const stamp = fmtDate(m.date);

  return (
    <section className="gallery">
      <h2 className="sub">{title}</h2>
      <div className="mosaic">
        {list.map((x, n) => (
          <button key={x.src + n} className="th" onPointerMove={tilt(20)} onPointerLeave={flat} onClick={() => open(n)} aria-label={`Open: ${x.caption || "media"}`}>
            <Thumb m={x} />
            <i className="glare" />
            {x.date && <time className="stamp" dateTime={x.date}>{fmtDate(x.date)}</time>}
            {x.caption && <span className="cap">{x.caption}</span>}
          </button>
        ))}
      </div>

      <dialog ref={box} className="lightbox" onClose={() => setOn(false)} onClick={(e) => e.target === box.current && box.current.close()}
        onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}>
        {on && (
          <figure className="lb-stage" onPointerMove={isVideo(m) ? undefined : tilt(10)} onPointerLeave={flat}>
            {isVideo(m)
              ? id ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={m.caption || "Video"} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
                : m.src ? <video src={m.src} poster={m.poster || undefined} controls autoPlay playsInline />
                : <img src={m.poster} alt={m.caption || ""} />
              : <img src={m.src} alt={m.caption || ""} />}
            <figcaption>{stamp && <time>{stamp}</time>}{stamp && m.caption ? " · " : ""}{m.caption}</figcaption>
          </figure>
        )}
        <div className="lbbar">
          <span className="lbdots">{list.map((_, n) => <i key={n} className={n === i ? "on" : ""} />)}</span>
          <button onClick={() => step(-1)}>Previous</button>
          <button onClick={() => step(1)}>Next</button>
          <button onClick={() => box.current.close()}>Close</button>
        </div>
      </dialog>
    </section>
  );
}
