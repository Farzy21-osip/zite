import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stage from "../../../components/Stage";
import Story from "../../../components/Story";
import Gallery from "../../../components/Gallery";
import Subs from "../../../components/Subs";
import Related from "../../../components/Related";
import Docs from "../../../components/Docs";
import { slug } from "../../../lib/slug";
import { fmtDate } from "../../../lib/media";
import { content, topLevel, childrenOf, relatedFor } from "../../../lib/data";

export const generateStaticParams = () => content().projects.map((p) => ({ slug: slug(p.title) }));

export async function generateMetadata({ params }) {
  const { slug: s } = await params;
  const p = content().projects.find((x) => slug(x.title) === s);
  return { title: p ? p.title : "Project" };
}

async function Detail({ params }) {
  const { slug: s } = await params;
  const all = content();
  const { projects } = all;
  const p = projects.find((x) => slug(x.title) === s);
  if (!p) notFound();
  const parent = projects.find((x) => x.title === p.parent);
  const sibs = parent ? projects.filter((x) => x.parent === parent.title) : topLevel(projects);
  const i = Math.max(0, sibs.findIndex((x) => x.title === p.title));
  const prev = sibs[(i + sibs.length - 1) % sibs.length], next = sibs[(i + 1) % sibs.length];
  const meta = [["When", fmtDate(p.date) || p.year], ["Type", p.kind === "school" ? "School and competition" : "Hobby"], ["Role", p.role], ["Status", p.status], ["Tags", (p.tags ?? []).join(", ")]].filter(([, v]) => v);
  return (
    <main className="page">
      <Stage items={[p]} on />
      <div className="wrap">
        <Link className="crumb" href={parent ? `/projects/${slug(parent.title)}` : `/projects#${s}`}>{parent ? `Back to ${parent.title}` : "All projects"}</Link>
        <header className="dhead">
          {p.icon && <img className="ico xl" src={p.icon} alt="" />}
          <div><h1 className="ph">{p.title}</h1><p className="lede">{p.summary}</p></div>
        </header>
        <dl className="meta">{meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <Gallery items={p.media} />
        {p.story?.length > 0 && <Story chapters={p.story} />}
        <Subs items={childrenOf(projects, p)} base="/projects" title="Inside this project" />
        <Related items={relatedFor(all, "projects", p)} />
        <Docs items={p.docs} />
        {sibs.length > 1 && (
          <div className="pn">
            <Link href={`/projects/${slug(prev.title)}`}>Previous: {prev.title}</Link>
            <Link href={`/projects/${slug(next.title)}`}>Next: {next.title}</Link>
          </div>
        )}
      </div>
    </main>
  );
}

// params must be read inside <Suspense> in current Next.js versions, or dev mode reports an error
export default function Page({ params }) {
  return (
    <Suspense fallback={<main className="page" />}>
      <Detail params={params} />
    </Suspense>
  );
}
