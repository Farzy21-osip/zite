import Stage from "../../components/Stage";
import { slug } from "../../lib/slug";
import { achievements } from "../../lib/data";

export const metadata = { title: "Achievements" };

export default function Page() {
  const awards = achievements.filter((a) => a.type === "award");
  const reflections = achievements.filter((a) => a.type === "reflection");
  return (
    <main className="page">
      <Stage items={awards} />
      <div className="wrap">
        <h1 className="ph">Awards</h1>
        <p className="lede">What I won, and the competition behind each one.</p>
        <ol className="awards">
          {awards.map((a) => (
            <li key={a.title} id={slug(a.title)} data-pop={slug(a.title)}>
              <span className="yr">{a.year}</span>
              <div>
                <h3 className="at">{a.icon && <img className="ico lg" src={a.icon} alt="" />}{a.title}</h3>
                <p>{a.text}</p>
              </div>
              {a.icon && <img className="pop" src={a.icon} alt="" />}
            </li>
          ))}
        </ol>

        <h2 className="sub">All reflections</h2>
        <p className="lede tight">Written for every competition, whether or not I placed. Open one to read it.</p>
        <ol className="tl">
          {reflections.map((r) => (
            <li key={r.title} id={slug(r.title)} data-t="reflection">
              <details>
                <summary><i>{r.year}</i><b>{r.title}</b><em>{r.result}</em></summary>
                <p>{r.text}</p>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
