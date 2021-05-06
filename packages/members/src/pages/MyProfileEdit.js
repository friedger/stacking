import React from 'react';
import { useStxAddresses } from '../lib/hooks';
import { PoolForm } from '../components/PoolForm';

export default function MyProfileEdit({ userSession, poolId }) {
  console.log({ userSession, poolId });
  const { ownerStxAddress } = useStxAddresses(userSession);

  return (
    <main className="panel-welcome mt-5 container">
      <div className="row">
        <div className="mx-auto col-sm-10 col-md-8 px-4">
          <PoolForm ownerStxAddress={ownerStxAddress} poolId={poolId} />
        </div>
      </div>
    </main>
  );
}
