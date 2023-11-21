import React from 'react';
export function PayoutState({ payoutState }) {
  return payoutState ? (
    <>
      Any potential rewards from Fast Pool will be distributed in STX.
      {payoutState.xbtc ? ' Even though you requested xBTC rewards' : ''}.
    </>
  ) : null;
}
