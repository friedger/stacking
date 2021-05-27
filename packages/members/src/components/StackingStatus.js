import React from 'react';
import { Amount } from './Amount';

export function StackingStatus({ stackingStatus }) {
  return stackingStatus ? (
    stackingStatus.stacked ? (
      <>
        You stacked <Amount ustx={stackingStatus.details.amount_microstx} /> until cycle #
        {stackingStatus.details.first_reward_cycle + stackingStatus.details.lock_period}.
      </>
    ) : (
      <>You are currently not stacking.</>
    )
  ) : null;
}
