import { slug } from "../lib/slug";

// Full-screen background layers, one per item. PopLayer fades in the layer of the item under the cursor.
// An item with `bg` (image path) uses that image; otherwise a generated placeholder from its `hue`.
export default function Stage({ items }) {
  return (
    <div className="stage" aria-hidden="true">
      {items.map((it) => (
        <div key={it.title} className={it.bg ? "layer" : "layer gen"} data-for={slug(it.title)}
          style={it.bg ? { backgroundImage: `url(${it.bg})` } : { "--h": it.hue ?? 200 }} />
      ))}
    </div>
  );
}
