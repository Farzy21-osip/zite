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
import { content, childrenOf, relatedFor } from "../../../lib/data";

export const generateStaticParams = () => content().achievements.map((a) => ({ slug: slug(a.title) }));

export async function generateMetadata({ params }) {
  const { slug: s } = await params;
  const a = content().achievements.find((x) => slug(x.title) === s);
  return { title: a ? a.title : "Competition" };
}

async function Detail({ params }) {
  const { slug: s } = await params;
  const all = content();
  const { achievements } = all;
  const a = achievements.find((x) => slug(x.title) === s);
  if (!a) notFound();
  const parent = achievements.find((x) => x.title === a.parent);
  const pair = a.comp ? achievements.filter((x) => x.comp === a.comp) : [a];
  const award = pair.find((x) => x.type === "award");
  const refl = pair.find((x) => x.type === "reflection");
  const meta = [["When", fmtDate(a.date) || a.year], ["Event", a.event], ["Result", refl?.result || (award ? "Award" : "")]].filter(([, v]) => v);
  return (
    <main className="page">
      <Stage items={[a]} on />
      <div className="wrap">
        <Link className="crumb" href={parent ? `/achievements/${slug(parent.title)}` : `/achievements#${s}`}>{parent ? `Back to ${parent.title}` : "All achievements"}</Link>
        <header className="dhead">
          {a.icon && <img className="ico xl" src={a.icon} alt="" />}
          <div><h1 className="ph">{a.title}</h1><p className="lede">{award ? award.text : "No award this time. The reflection below is the real result."}</p></div>
        </header>
        <dl className="meta">{meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <Gallery items={a.media} />
        {a.story?.length > 0 && <Story chapters={a.story} />}
        {refl && (
          <section className="story">
            <article className="chapter"><h2>Reflection</h2><p>{refl.text}</p></article>
          </section>
        )}
        <Subs items={childrenOf(achievements, a)} base="/achievements" title="Inside this award" />
        <Related items={relatedFor(all, "achievements", a)} />
        <Docs items={a.docs} />
      </div>
    </main>
  );
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<main className="page" />}>
      <Detail params={params} />
    </Suspense>
  );
}
