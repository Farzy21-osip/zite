import ProjectBrowser from "../../components/ProjectBrowser";
import Stage from "../../components/Stage";
import { projects } from "../../lib/data";

export const metadata = { title: "Projects" };

export default function Page() {
  return (
    <main className="page">
      <Stage items={projects} />
      <div className="wrap">
        <h1 className="ph">Projects</h1>
        <p className="lede">Hover or tab through a project: its icon pops up and the screen takes on its design.</p>
        <ProjectBrowser items={projects} />
      </div>
    </main>
  );
}
