import FieldHero from "../components/FieldHero";
import Preview from "../components/Preview";
import { slug } from "../lib/slug";
import { content, topLevel } from "../lib/data";

// Each preview row opens the full page and highlights that exact item (via #id).
const go = (page, title) => `/${page}#${slug(title)}`;
const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

export default function Home() {
  const { site, projects: allProjects, achievements: allAch, activity, papers } = content();
  const projects = topLevel(allProjects), achievements = topLevel(allAch);
  return (
    <main>
      <header className="hero" id="top">
        <FieldHero />
        <div className="wrap">
          <h1>{site.texts.heroTitle}</h1>
          <p className="lede">{site.texts.heroLede}</p>
        </div>
      </header>

      <Preview id="projects" title="Projects" lede={site.texts.projectsHome} href="/projects" cta="See all projects"
        items={projects.slice(0, 3).map((p) => ({ title: p.title, tag: p.tags?.[0], icon: p.icon, href: go("projects", p.title) }))} />

      <Preview id="achievements" title="Awards" lede={site.texts.achievementsHome} href="/achievements" cta="See achievements"
        items={achievements.filter((a) => a.type === "award").slice(0, 3).map((a) => ({ title: a.title, tag: a.year, icon: a.icon, href: go("achievements", a.title) }))} />

      <Preview id="activity" title="Activity" lede={site.texts.activityHome} href="/activity" cta="See activity"
        items={activity.slice(0, 3).map((a) => ({ title: a.title, tag: cap(a.kind), tone: "teal", href: go("activity", a.title) }))} />

      <Preview id="papers" title="Research and essays" lede={site.texts.papersHome} href="/papers" cta="See all papers"
        items={papers.filter((p) => p.kind === "essay").slice(0, 3).map((p) => ({ title: p.title, tag: "Essay", tone: "teal", href: go("papers", p.title) }))} />
    </main>
  );
}
