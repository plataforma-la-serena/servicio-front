const COLUMNS = Array.from({ length: 12 }, (_, index) => index);

export function GridLines() {
  return (
    <div className="grid-lines" aria-hidden="true">
      <div className="grid-lines-shell">
        {COLUMNS.map((column) => (
          <span key={column} className="grid-line" />
        ))}
      </div>
    </div>
  );
}
