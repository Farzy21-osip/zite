import Link from "next/link";
import Rows from "./Rows";

export default function Preview({ id, title, lede, href, cta, items, light }) {
  return (
    <section id={id} className={light ? "paper" : undefined}>
      <div className="wrap preview">
        <div>
          <h2>{title}</h2>
          <p className="lede">{lede}</p>
          <Link className="more" href={href}>{cta}</Link>
        </div>
        <Rows items={items} />
      </div>
    </section>
  );
}
