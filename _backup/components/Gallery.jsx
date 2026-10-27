"use client";
import { useRef, useState } from "react";

export default function Gallery({ items }) {
  const box = useRef(null);
  const [i, setI] = useState(0);
  if (!items?.length) return null;
  const open = (n) => { setI(n); box.current.showModal(); };
  const step = (d) => setI((i + d + items.length) % items.length);
  return (
    <section className="gallery">
      <h2 className="sub">Photos and media</h2>
      <div className="thumbs">
        {items.map((m, n) => (
          <button key={m.src} onClick={() => open(n)} aria-label={`Open: ${m.caption}`}><img src={m.src} alt={m.caption} /></button>
        ))}
      </div>
      <dialog ref={box} className="lightbox" onClick={(e) => e.target === box.current && box.current.close()}
        onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}>
        <figure><img src={items[i].src} alt={items[i].caption} /><figcaption>{items[i].caption}</figcaption></figure>
        <div className="lbbar">
          <button onClick={() => step(-1)}>Previous</button>
          <button onClick={() => step(1)}>Next</button>
          <button onClick={() => box.current.close()}>Close</button>
        </div>
      </dialog>
    </section>
  );
}
