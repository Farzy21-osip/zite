import Rows from "../../components/Rows";
import { content } from "../../lib/data";

export const metadata = { title: "Learning Journey" };

const rows = (learning, kind) => learning.filter((l) => l.kind === kind).map((l) => ({ title: l.title, desc: l.blurb, tag: kind === "doodle" ? "Doodle" : "Explained", tone: "teal" }));

export default function Page() {
  const { site, learning } = content();
  return (
    <main className="page paper">
      <div className="wrap">
        <h1 className="ph">Learning Journey</h1>
        <p className="lede">{site.texts.learningPage}</p>
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
    </main>
  );
}
