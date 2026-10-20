export default function Chips({ opts, val, set }) {
  return (
    <div className="chips">
      {opts.map(([k, label]) => (
        <button key={k} aria-pressed={val === k} onClick={() => set(k)}>{label}</button>
      ))}
    </div>
  );
}
