import ProjectBrowser from "../../components/ProjectBrowser";
import Stage from "../../components/Stage";
import { content } from "../../lib/data";

export const metadata = { title: "Projects" };

export default function Page() {
  const { site, projects } = content();
  return (
    <main className="page">
      <Stage items={projects} />
      <div className="wrap">
        <h1 className="ph">Projects</h1>
        <p className="lede">{site.texts.projectsPage}</p>
        <ProjectBrowser items={projects} />
      </div>
    </main>
  );
}
