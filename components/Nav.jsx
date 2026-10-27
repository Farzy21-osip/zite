"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [["/projects", "Projects"], ["/achievements", "Achievements"], ["/activity", "Activity"], ["/papers", "Papers"], ["/me", "Me"]];

export default function Nav({ site }) {
  const path = usePathname();
  const ul = useRef(null);
  const [ind, setInd] = useState({ x: 0, w: 0, on: false });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isOn = (h) => h === path || (!h.startsWith("#") && path.startsWith(h + "/"));
  const active = links.findIndex(([h]) => isOn(h));

  // The glowing pill slides to the hovered link, then settles back on the current page.
  const place = (i) => {
    const el = i >= 0 ? ul.current?.children[i] : null;
    setInd(el ? { x: el.offsetLeft, w: el.offsetWidth, on: true } : (p) => ({ ...p, on: false }));
  };
  useEffect(() => {
    place(active);
    const r = () => place(active);
    addEventListener("resize", r);
    return () => removeEventListener("resize", r);
  }, [active]);
  useEffect(() => {
    const s = () => setScrolled(scrollY > 24);
    s();
    addEventListener("scroll", s, { passive: true });
    return () => removeEventListener("scroll", s);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);

  if (path.startsWith("/admin")) return null;
  return (
    <nav className="bar" data-scrolled={scrolled ? "" : undefined} data-open={open ? "" : undefined}>
      <div className="bar-in">
        <Link href="/" className="brand"><span>{site.first}</span><b>{site.main}</b>{site.last && <span className="last">{site.last}</span>}</Link>
        <button className="burger" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        <div className="links" onMouseLeave={() => place(active)}>
          <span className="ind" data-on={ind.on ? "" : undefined} style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} />
          <ul ref={ul}>
            {links.map(([href, label], i) => (
              <li key={href} onMouseEnter={() => place(i)} onFocus={() => place(i)} onBlur={() => place(active)}>
                {href.startsWith("#")
                  ? <a href={href} onClick={() => setOpen(false)}>{label}</a>
                  : <Link href={href} aria-current={isOn(href) ? "page" : undefined}>{label}</Link>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
