import React from 'react';
import { PoolForm } from '../components/PoolForm';
import { useStxAddresses } from '../lib/hooks';

export default function MyProfileRegister({ userSession }) {
  console.log(userSession);
  const { ownerStxAddress } = useStxAddresses(userSession);

  return (
    <main className="panel-welcome mt-5 container">
      <div className="row">
        <div className="mx-auto col-sm-10 col-md-8 px-4">
          <PoolForm register ownerStxAddress={ownerStxAddress} />
        </div>
      </div>
    </main>
  );
}
