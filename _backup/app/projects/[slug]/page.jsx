import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stage from "../../../components/Stage";
import Story from "../../../components/Story";
import Series from "../../../components/Series";
import Gallery from "../../../components/Gallery";
import Docs from "../../../components/Docs";
import { slug } from "../../../lib/slug";
import { content } from "../../../lib/data";

export const generateStaticParams = () => content().projects.map((p) => ({ slug: slug(p.title) }));

export async function generateMetadata({ params }) {
  const { slug: s } = await params;
  const { projects } = content();
  const p = projects.find((x) => slug(x.title) === s);
  return { title: p ? p.title : "Project" };
}

async function Detail({ params }) {
  const { slug: s } = await params;
  const { projects } = content();
  const i = projects.findIndex((x) => slug(x.title) === s);
  if (i < 0) notFound();
  const p = projects[i];
  const prev = projects[(i + projects.length - 1) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const meta = [["Year", p.year], ["Type", p.kind === "school" ? "School and competition" : "Hobby"], ["Role", p.role], ["Status", p.status], ["Tags", (p.tags ?? []).join(", ")]];
  return (
    <main className="page">
      <Stage items={[p]} on />
      <div className="wrap">
        <Link className="crumb" href={`/projects#${s}`}>All projects</Link>
        <header className="dhead">
          {p.icon && <img className="ico xl" src={p.icon} alt="" />}
          <div><h1 className="ph">{p.title}</h1><p className="lede">{p.summary}</p></div>
        </header>
        <dl className="meta">{meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        {p.story?.length > 0 && <Story chapters={p.story} />}
        {p.type === "series" && p.items?.length > 0 && <Series items={p.items} />}
        <Gallery items={p.media} />
        <Docs items={p.docs} />
        <div className="pn">
          <Link href={`/projects/${slug(prev.title)}`}>Previous: {prev.title}</Link>
          <Link href={`/projects/${slug(next.title)}`}>Next: {next.title}</Link>
        </div>
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
