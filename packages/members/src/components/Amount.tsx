import { ClarityType, hexToCV } from '@stacks/transactions';

export function tokenAmountToNumber(ustx) {
  if (typeof ustx === 'object' && ustx.data) {
    const ustxCV = hexToCV(ustx.data);
    if (ustxCV.type === ClarityType.UInt) {
      return ustx.value.toNumber();
    } else {
      return null;
    }
  } else if (typeof ustx == 'object' && ustx.words) {
    return ustx.toNumber();
  } else if (typeof ustx === 'string') {
    return parseInt(ustx);
  } else if (typeof ustx === 'number') {
    return ustx;
  } else {
    return null;
  }
}

export function Amount({ ustx, className }) {
  if (typeof ustx !== 'bigint') {
    const ustxNumber = tokenAmountToNumber(ustx);
    if (ustxNumber) {
      return (
        <>
          {(ustxNumber / 1000000).toLocaleString(undefined, {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          Ӿ
        </>
      );
    } else {
      console.log({ ustx });
      return ustx;
    }
  }
  return (
    <span className={className}>
      {(ustx / 1000000n).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      Ӿ
    </span>
  );
}

export function AmountBTC({ sats, tokenSymbol, className }) {
  console.log({ sats });
  if (typeof sats !== 'bigint') {
    const satsNumber = tokenAmountToNumber(sats);
    if (satsNumber) {
      return (
        <>
          {(satsNumber / 100_000_000).toLocaleString(undefined, {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 8,
          })}{' '}
          {tokenSymbol || 'BTC'}
        </>
      );
    } else {
      console.log({ sats });
      return sats;
    }
  }
  return (
    <span className={className}>
      {(sats / 100_000_000).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 8,
      })}{' '}
      {tokenSymbol || 'BTC'}
    </span>
  );
}
