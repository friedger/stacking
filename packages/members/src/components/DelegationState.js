import { ClarityType, cvToString } from '@stacks/transactions';
import React from 'react';
import { Amount } from './Amount';
export function DelegationState({ delegationState }) {
  const untilBurnHt =
    delegationState &&
    delegationState.state &&
    delegationState.state.data['until-burn-ht'].type === ClarityType.OptionalSome
      ? delegationState.state.data['until-burn-ht'].value.value
      : undefined;
  return delegationState ? (
    delegationState.state ? (
      <>
        You have joined the pool {cvToString(delegationState.state.data['delegated-to'])} with{' '}
        <Amount ustx={delegationState.state.data['amount-ustx'].value} />.<br />
        {untilBurnHt ? (
          <>
            The membership expires/expired at{' '}
            <a href={`https://live.blockcypher.com/btc/block/${untilBurnHt}/`}>
              bitcoin block #{untilBurnHt}
            </a>
            .
          </>
        ) : (
          <>The membership does not expire. You can revoke membership with your wallet.</>
        )}
      </>
    ) : (
      <>
        You are not delegating to any pool. Join now <a href="https://lockstacks.com">here</a>.
      </>
    )
  ) : null;
}
