import OrbitImages from "../../components/OrbitImages";
import { fmtDate } from "../../lib/media";
import { content } from "../../lib/data";

export const metadata = { title: "Me" };

export default function Page() {
  const { site, me } = content();
  const photos = (me.photos ?? []).filter((p) => p.src);
  return (
    <main className="page me">
      <header className="wrap cv">
        <div className="cv-photo">
          {me.portrait ? <img src={me.portrait} alt={`Portrait of ${site.first} ${site.main}`} /> : <span>Add your photo in the admin</span>}
        </div>
        <div className="cv-info">
          <h1 className="ph"><span>{site.first}</span> <b>{site.main}</b> {site.last && <span>{site.last}</span>}</h1>
          {me.role && <p className="cv-role">{me.role}</p>}
          {me.headline && <p className="cv-head">{me.headline}</p>}
          {me.intro && <p className="cv-intro">{me.intro}</p>}
          {me.facts?.length > 0 && <dl className="cv-facts">{me.facts.map((f, i) => <div key={i}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}</dl>}
          <div className="cv-links">
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
            {(me.links ?? []).filter((l) => l.href).map((l, i) => <a key={i} href={l.href}>{l.label || l.href}</a>)}
          </div>
        </div>
      </header>

      {photos.length > 0 && (
        <div className="orbit-wrap">
          <OrbitImages
            images={photos.map((p) => p.src)}
            alts={photos.map((p) => p.caption)}
            dates={photos.map((p) => fmtDate(p.date))}
            shape="ellipse" radiusX={510} radiusY={80} rotation={-8} duration={30} itemSize={142} depth={0.45}
            showPath centerContent={<h2>{me.orbitTitle}</h2>} radius={160} itemRadius={14} shadow={0.3}
            hoverScale={1.08} hoverSpeed={0.3} pathDash={0} direction="normal" easing="linear"
            fill alignToPath={false} draggable clickToFront paused={false} intro
          />
        </div>
      )}

      <div className="wrap">
        {(me.sections ?? []).map((s, i) => (
          <section className="mesec" key={i}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
