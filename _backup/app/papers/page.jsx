import Meter from "../../components/Meter";
import { slug } from "../../lib/slug";
import { content } from "../../lib/data";

export const metadata = { title: "Papers" };

export default function Page() {
  const { site, papers } = content();
  const essays = papers.filter((p) => p.kind === "essay");
  const ideas = papers.filter((p) => p.kind === "idea");
  return (
    <main className="page">
      <div className="wrap">
        <h1 className="ph">Research and essays</h1>
        <p className="lede">{site.texts.papersPage}</p>
        <ul className="essays">
          {essays.map((p) => (
            <li key={p.title} id={slug(p.title)}>
              <b>{p.title}</b><span>{p.blurb}</span>
            </li>
          ))}
        </ul>

        <h2 className="sub">Ideas &amp; Philosophy</h2>
        <p className="lede tight">Shorter and earlier. The three bars show how settled each one is: Draft, Exploring, then Revised.</p>
        <ul className="ideas">
          {ideas.map((p) => (
            <li key={p.title} id={slug(p.title)}>
              <b>{p.title}</b><Meter status={p.status} /><span>{p.blurb}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
