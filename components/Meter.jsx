const level = { Draft: 1, Exploring: 2, Revised: 3 };

export default function Meter({ status }) {
  return (
    <em className="teal">
      <i className="meter">{[1, 2, 3].map((n) => <s key={n} className={n <= level[status] ? "on" : undefined} />)}</i>
      {status}
    </em>
  );
}
