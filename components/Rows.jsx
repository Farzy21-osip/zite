import Link from "next/link";
import { slug } from "../lib/slug";

export default function Rows({ items }) {
  return (
    <ul className="rows">
      {items.map(({ title, desc, tag, tone, href = "#", icon }) => {
        const id = slug(title);
        return (
          <li key={title} id={id} data-pop={icon ? id : undefined}>
            <Link href={href}>
              <b>{icon && <img className="ico" src={icon} alt="" />}{title}</b>
              <em className={tone}>{tag}</em>
              {desc && <span>{desc}</span>}
            </Link>
            {icon && <img className="pop" src={icon} alt="" />}
          </li>
        );
      })}
    </ul>
  );
}
