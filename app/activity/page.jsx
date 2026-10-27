import ActivityBoard from "../../components/ActivityBoard";
import { content, relatedFor } from "../../lib/data";

export const metadata = { title: "Activity" };

export default function Page() {
  const all = content();
  const { site } = all;
  const activity = all.activity.map((a) => ({ ...a, rel: relatedFor(all, "activity", a) }));
  return (
    <main className="page act">
      <div className="wrap">
        <h1 className="ph">Activity</h1>
        <p className="lede">{site.texts.activityPage}</p>
        <ActivityBoard items={activity} />
      </div>
    </main>
  );
}
