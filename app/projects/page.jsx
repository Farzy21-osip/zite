import ProjectBrowser from "../../components/ProjectBrowser";
import Stage from "../../components/Stage";
import { content, topLevel, childrenOf } from "../../lib/data";

export const metadata = { title: "Projects" };

export default function Page() {
  const { site, projects: all } = content();
  const projects = topLevel(all).map((p) => ({ ...p, subCount: childrenOf(all, p).length }));
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
