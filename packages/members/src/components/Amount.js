export function Amount({ ustx, className }) {
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <span className={className}>
      {(ustx / 1000000).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}
      Ӿ
    </span>
  );
}
