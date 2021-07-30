import { ClarityType, hexToCV } from '@stacks/transactions';
import BN from 'bn.js';

function ustxToNumber(ustx) {
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
    const bn = new BN(ustx);
    return bn.toNumber();
  } else {
    return null;
  }
}

export function Amount({ ustx, className }) {
  if (typeof ustx !== 'bigint') {
    const ustxNumber = ustxToNumber(ustx);
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
