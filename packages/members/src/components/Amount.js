export function Amount({ ustx, className }) {
  if (typeof ustx !== "bigint") {
    return ustx;
  }
  return (
    <span className={className}>
      {(ustx / 1000000n).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}
      Ӿ
    </span>
  );
}
