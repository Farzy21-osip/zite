export default function Docs({ items }) {
  if (!items?.length) return null;
  return (
    <section className="docsec">
      <h2 className="sub">Documents and links</h2>
      <ul className="docs">
        {items.map((d) => (
          <li key={d.title}><a href={d.href}>{d.title}<em>{d.kind}</em></a></li>
        ))}
      </ul>
    </section>
  );
}
