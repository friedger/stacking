

export function toHumanReadableStx(
  microStx: string | number | bigint ,
  decimalPlaces?: number
): string {
  const amount = Number(BigInt(microStx)) / 10**6;
  return amount.toLocaleString(undefined, {maximumFractionDigits: 6}) + " STX";
}
