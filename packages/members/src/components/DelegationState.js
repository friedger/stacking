import { cvToString } from '@stacks/transactions';
import React from 'react';
import { Amount } from './Amount';
export function DelegationState({ delegationState }) {
  return delegationState ? (
    delegationState.state ? (
      <>
        You have joined the pool {cvToString(delegationState.state.data['delegated-to'])} with{' '}
        <Amount ustx={delegationState.state.data['amount-ustx'].value} />.
      </>
    ) : (
      <>
        You are not delegating to any pool. Join now{' '}
        <a href="https://stacks-pool-registry.pages.dev">here</a>.
      </>
    )
  ) : null;
}
