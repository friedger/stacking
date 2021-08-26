import React from 'react';
import { ClaimRewards } from '../components/ClaimRewards';
import { useConnect } from '../lib/auth';
import { FPWR_04_CONTRACT, FPWR_04_DEPOT_CONTRACT } from '../lib/constants';

// Landing page demonstrating Blockstack connect for registration

export default function Landing() {
  const { handleOpenAuth } = useConnect();

  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container">
          <div className="panel-landing text-center mt-3">
            <p className="lead">Enjoy the exclusive Friedger Pool membership!</p>
            <p className="card-link mb-5">
              <button className="btn btn-outline-primary" type="button" onClick={handleOpenAuth}>
                Start now
              </button>
            </p>
            <hr />
            <h4>Check Stacking rewards</h4>
            <ClaimRewards
              cycle={14}
              tokenContract={FPWR_04_CONTRACT}
              depotContract={FPWR_04_DEPOT_CONTRACT}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
