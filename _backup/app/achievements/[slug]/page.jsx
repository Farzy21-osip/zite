import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stage from "../../../components/Stage";
import Gallery from "../../../components/Gallery";
import Docs from "../../../components/Docs";
import { slug } from "../../../lib/slug";
import { content } from "../../../lib/data";

export const generateStaticParams = () => content().achievements.map((a) => ({ slug: slug(a.title) }));

export async function generateMetadata({ params }) {
  const { slug: s } = await params;
  const { achievements } = content();
  const a = achievements.find((x) => slug(x.title) === s);
  return { title: a ? a.title : "Competition" };
}

async function Detail({ params }) {
  const { slug: s } = await params;
  const { achievements } = content();
  const a = achievements.find((x) => slug(x.title) === s);
  if (!a) notFound();
  const pair = achievements.filter((x) => x.comp === a.comp);
  const award = pair.find((x) => x.type === "award");
  const refl = pair.find((x) => x.type === "reflection");
  const meta = [["Year", a.year], ["Event", a.event || "-"], ["Result", refl?.result ?? "Award"]];
  return (
    <main className="page">
      <Stage items={[a]} on />
      <div className="wrap">
        <Link className="crumb" href={`/achievements#${s}`}>All achievements</Link>
        <header className="dhead">
          {a.icon && <img className="ico xl" src={a.icon} alt="" />}
          <div><h1 className="ph">{a.title}</h1><p className="lede">{award ? award.text : "No award this time. The reflection below is the real result."}</p></div>
        </header>
        <dl className="meta">{meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        {refl && (
          <section className="story">
            <article className="chapter"><h2>Reflection</h2><p>{refl.text}</p></article>
          </section>
        )}
        <Gallery items={a.media} />
        <Docs items={a.docs} />
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
