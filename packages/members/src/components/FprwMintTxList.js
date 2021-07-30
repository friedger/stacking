import React, { useState, useEffect } from 'react';
import { fetchSubmittedTxList } from '../lib/wrappedRewards';
import { FprwMintTx } from './FprwMintTx';

export function FprwMintTxList() {
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [txs, setTxs] = useState();

  useEffect(() => {
    setLoading(true);
    fetchSubmittedTxList()
      .then(tx => {
        setStatus(undefined);
        setTxs(tx);
        setLoading(false);
      })
      .catch(e => {
        setStatus('Failed to get txs', e);
        console.log(e);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h5>All Reported Bitcoin Transactions</h5>
      <div
        role="status"
        className={`${
          loading ? '' : 'd-none'
        } spinner-border spinner-border-sm text-info align-text-top mr-2`}
      />
      {txs &&
        txs.map((tx, key) => {
          return <FprwMintTx key={key} tx={tx} />;
        })}
      {!txs && <>No transactions yet reported. Report one!</>}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
