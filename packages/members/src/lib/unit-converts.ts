import BigNumber from "bignumber.js";

function parseNumber(num: string | number | BigNumber) {
  return new BigNumber(num);
}

export function microStxToStx(
  microStx: string | number | bigint | BigNumber
): BigNumber {
  const amount = parseNumber(
    typeof microStx === "bigint" ? microStx.toString() : microStx
  );
  if (!amount.isInteger())
    throw new Error("Micro STX can only be represented as integers");
  return amount.dividedBy(10 ** 6);
}

export function toHumanReadableStx(
  microStx: string | number | bigint | BigNumber,
  decimalPlaces?: number
): string {
  const amount = microStxToStx(microStx);
  return amount.toFormat(decimalPlaces) + " STX";
}
