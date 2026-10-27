import Link from "next/link";
import { slug } from "../lib/slug";
import { fmtDate, previewOf } from "../lib/media";

// The sub-projects (or sub-awards) inside a project (or award).
export default function Subs({ items, base, title }) {
  if (!items?.length) return null;
  return (
    <section className="subs">
      <h2 className="sub">{title}</h2>
      <div className="subgrid">
        {items.map((s) => {
          const img = previewOf(s);
          return (
            <Link key={s.title} className="subcard" href={`${base}/${slug(s.title)}`}>
              <span className="rel-img">{img ? <img src={img} alt="" /> : <i />}</span>
              <span className="rel-txt">
                <em>{fmtDate(s.date) || s.year}</em>
                <b>{s.title}</b>
                <small>{s.summary || s.blurb || s.text}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
