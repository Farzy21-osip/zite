import { slug } from "../lib/slug";

// Full-screen background layers, one per item. PopLayer fades in the layer of the item under the cursor,
// and detail pages show their own layer all the time (on).
// An item can have a background image (bg), one or two colors (bgColor, bgColor2) and a darkness (bgDim, 0-90).
// With none of these, a placeholder is generated from its hue.
export default function Stage({ items, on }) {
  return (
    <div className="stage" aria-hidden="true">
      {items.map((it) => {
        const grad = it.bgColor ? `linear-gradient(135deg, ${it.bgColor}, ${it.bgColor2 || it.bgColor})` : "";
        const layers = [it.bg ? `url(${it.bg})` : "", grad].filter(Boolean).join(", ");
        const style = { "--h": it.hue ?? 200 };
        if (layers) style.backgroundImage = layers;
        if (it.bgDim !== undefined && it.bgDim !== "") style["--dim"] = Math.min(90, Math.max(0, Number(it.bgDim))) / 100;
        return <div key={it.title} className={layers ? "layer" : "layer gen"} data-for={slug(it.title)} data-on={on ? "" : undefined} style={style} />;
      })}
    </div>
  );
}
