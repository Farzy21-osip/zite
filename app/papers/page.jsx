import Meter from "../../components/Meter";
import Rows from "../../components/Rows";
import Related from "../../components/Related";
import { slug } from "../../lib/slug";
import { content, relatedFor } from "../../lib/data";

export const metadata = { title: "Papers" };

const rows = (learning, kind) => learning.filter((l) => l.kind === kind).map((l) => ({ title: l.title, desc: l.blurb, tag: kind === "doodle" ? "Doodle" : "Explained", tone: "teal" }));

export default function Page() {
  const all = content();
  const { site, papers, learning } = all;
  const rel = (p) => <Related compact items={relatedFor(all, "papers", p)} />;
  const essays = papers.filter((p) => p.kind === "essay");
  const ideas = papers.filter((p) => p.kind === "idea");
  return (
    <main className="page nopad">
      <div className="wrap">
        <h1 className="ph">Research and essays</h1>
        <p className="lede">{site.texts.papersPage}</p>
        <ul className="essays">
          {essays.map((p) => (
            <li key={p.title} id={slug(p.title)}>
              <b>{p.title}</b><span>{p.blurb}</span>{rel(p)}
            </li>
          ))}
        </ul>

        <h2 className="sub">Ideas &amp; Philosophy</h2>
        <p className="lede tight">Shorter and earlier. The three bars show how settled each one is: Draft, Exploring, then Revised.</p>
        <ul className="ideas">
          {ideas.map((p) => (
            <li key={p.title} id={slug(p.title)}>
              <b>{p.title}</b><Meter status={p.status} /><span>{p.blurb}</span>{rel(p)}
            </li>
          ))}
        </ul>
      </div>

      <section className="paper lj" id="learning-journey">
        <div className="wrap">
          <h2 className="sub">Learning Journey</h2>
          <p className="lede tight">{site.texts.learningPage}</p>
          <div className="cols">
            <div><h3>Explained simply</h3><Rows items={rows(learning, "explained")} /></div>
            <div>
              <h3>Math doodles</h3>
              <Rows items={rows(learning, "doodle")} />
              <svg className="doodle" viewBox="0 0 200 120" fill="none" aria-hidden="true">
                <path d="M6 60 C 40 -10, 70 130, 100 60 S 160 -10, 194 60" stroke="#0B7A6B" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="100" cy="60" r="4" fill="#0C1428" />
              </svg>
              <p className="note">sketch first, explain later</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
