import React from 'react';
import { Amount } from './Amount';

export function StackingStatus({ stackingStatus }) {
  return stackingStatus ? (
    stackingStatus.stacked ? (
      <>
        Your stacked <Amount ustx={stackingStatus.details.amount_microstx} /> will unlock 100 blocks after the start of cycle #
        {stackingStatus.details.first_reward_cycle + stackingStatus.details.lock_period}.
      </>
    ) : (
      <>You are currently not stacking.</>
    )
  ) : null;
}
