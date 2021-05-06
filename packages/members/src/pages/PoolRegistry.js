import React, { useState, useRef } from 'react';

import { useStxAddresses } from '../lib/hooks';
import { PoolList } from '../components/PoolList';

export default function PoolRegistry(props) {
  const { ownerStxAddress } = useStxAddresses();
  const payoutRef = useRef();
  const lockingPeriodRef = useRef();
  const searchRef = useRef();
  const [payout, setPayout] = useState();
  const [lockingPeriod, setLockingPeriod] = useState();
  const [search, setSearch] = useState();

  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <h1 className="card-title">List of public pools</h1>
        </div>
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <select
            ref={payoutRef}
            onChange={e => {
              setPayout(e.target.value);
            }}
          >
            <option value="">any</option>
            <option value="BTC">BTC</option>
            <option value="STX">STX</option>
          </select>
          <input
            type="number"
            ref={lockingPeriodRef}
            placeholder="minimum locking period"
            onChange={e => {
              setLockingPeriod(parseInt(e.target.value.trim()));
            }}
          />
          <input
            type="text"
            ref={searchRef}
            placeholder="search term"
            onChange={e => {
              setSearch(e.target.value.trim());
            }}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setPayout(payoutRef.current.value);
              setLockingPeriod(parseInt(lockingPeriodRef.current.value.trim()));
              setSearch(searchRef.current.value.trim());
            }}
          >
            Filter
          </button>
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          <PoolList
            ownerStxAddress={ownerStxAddress}
            payout={payout}
            lockingPeriod={lockingPeriod}
            search={search}
            verifyUsername
          />
        </div>

        <div className="card col-md-8 mx-auto mt-5 mb-5 text-center px-0 border-warning">
          <div className="card-header">
            <h5 className="card-title">Instructions</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Select the pool you trust and click the join button.</li>
            <li className="list-group-item">
              Enter the amount, duration, and reward address to define how you would like to stack
              and click delegate.
            </li>
            <li className="list-group-item">
              Wait for the pool admin to do the necessary and collect your rewards.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
