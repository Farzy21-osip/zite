import FieldHero from "../components/FieldHero";
import Preview from "../components/Preview";
import { slug } from "../lib/slug";
import { projects, achievements, papers, learning } from "../lib/data";

// Each preview row opens the full page and highlights that exact item (via #id).
const go = (page, title) => `/${page}#${slug(title)}`;

export default function Home() {
  return (
    <main>
      <header className="hero" id="top">
        <FieldHero />
        <div className="wrap">
          <h1>I build things and write down how they work.</h1>
          <p className="lede">Electronics, code and physics: projects, competitions and the notes behind them.</p>
        </div>
      </header>

      <Preview id="projects" title="Projects" lede="Built for school, competitions and fun." href="/projects" cta="See all projects"
        items={projects.slice(0, 3).map((p) => ({ title: p.title, tag: p.tags[0], icon: p.icon, href: go("projects", p.title) }))} />

      <Preview id="achievements" title="Awards" lede="Plus a reflection for every competition." href="/achievements" cta="See achievements"
        items={achievements.filter((a) => a.type === "award").slice(0, 3).map((a) => ({ title: a.title, tag: a.year, icon: a.icon, href: go("achievements", a.title) }))} />

      <Preview light id="learning" title="Learning Journey" lede="Physics explained simply, and math doodles." href="/learning" cta="Open the notebook"
        items={learning.slice(0, 3).map((l) => ({ title: l.title, tag: l.kind === "doodle" ? "Doodle" : "Explained", tone: "teal", href: go("learning", l.title) }))} />

      <Preview id="papers" title="Research and essays" lede="Longer pieces of research and writing." href="/papers" cta="See all papers"
        items={papers.filter((p) => p.kind === "essay").slice(0, 3).map((p) => ({ title: p.title, tag: "Essay", tone: "teal", href: go("papers", p.title) }))} />
    </main>
  );
}
