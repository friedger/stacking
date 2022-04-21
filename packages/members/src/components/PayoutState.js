import React from 'react';
export function PayoutState({ payoutState }) {
  return payoutState ? (
    <>
      Any potential rewards from Friedger Pool will be distributed in{' '}
      {payoutState.xbtc ? 'xBTC' : 'STX'}.
    </>
  ) : null;
}
