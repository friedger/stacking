import React, { useState, useEffect } from 'react';

import { Pool } from './Pool';
import { fetchPools, usernameCVToName } from '../lib/pools';
import { poxCVToBtcAddress } from '../lib/pools-utils';
import { cvToString } from '@stacks/transactions';

export function PoolList({ payout, lockingPeriod, search, verifyUsername }) {
  const [status, setStatus] = useState();
  const [pools, setPools] = useState();

  useEffect(() => {
    setStatus('Loading pools');
    fetchPools({ verify: verifyUsername })
      .then(async pools => {
        setStatus(undefined);
        console.log(pools);
        setPools(pools);
      })
      .catch(e => {
        setStatus('Failed to get pools', e);
        console.log(e);
      });
  }, [verifyUsername]);

  const filteredPools =
    pools &&
    pools.filter(
      pool =>
        (!payout || pool.data['payout'].data === payout) &&
        (!lockingPeriod ||
          isNaN(lockingPeriod) ||
          pool.data['locking-period'].list.findIndex(item => {
            console.log({ i: item.value.toNumber(), lp: lockingPeriod });
            return item.value.toNumber() >= lockingPeriod;
          }) >= 0) &&
        (!search ||
          pool.data.fees.data.indexOf(search) >= 0 ||
          pool.data['date-of-payout'].data.indexOf(search) >= 0 ||
          pool.data['url'].data.indexOf(search) >= 0 ||
          usernameCVToName(pool.data.name).indexOf(search) >= 0 ||
          pool.data['pox-address'].list
            .map(addr => poxCVToBtcAddress(addr))
            .join(' ')
            .indexOf(search) >= 0 ||
          cvToString(pool.data.delegatee).indexOf(search) >= 0)
    );
  return (
    <div>
      {filteredPools &&
        filteredPools.map((pool, key) => {
          return <Pool key={key} pool={pool} poolId={key + 1} />;
        })}
      {!status && (!filteredPools || filteredPools.length === 0) && <>No pools found.</>}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
