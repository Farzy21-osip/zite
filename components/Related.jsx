import Link from "next/link";

// Navigation cards to connected items: one preview image, the kind, and the title.
export function RelGrid({ items }) {
  return (
    <div className="rel-grid">
      {items.map((r) => (
        <Link key={r.href} className="rel" href={r.href}>
          <span className="rel-img">{r.image ? <img src={r.image} alt="" /> : <i />}</span>
          <span className="rel-txt"><em>{r.label}</em><b>{r.title}</b></span>
        </Link>
      ))}
    </div>
  );
}

export default function Related({ items, compact, title = "Connected" }) {
  if (!items?.length) return null;
  if (compact) return <div className="rel-compact"><RelGrid items={items} /></div>;
  return <section className="related"><h2 className="sub">{title}</h2><RelGrid items={items} /></section>;
}
