import React, { useState, useEffect } from 'react';
import { fetchSubmittedTxList } from '../lib/wrappedRewards';
import { FpwrMintTx } from './FpwrMintTx';

export function FpwrMintTxList({ userSession, stxOwnerAddress }) {
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
      <h5>Some Reported Bitcoin Transactions</h5>
      <div
        role="status"
        className={`${
          loading ? '' : 'd-none'
        } spinner-border spinner-border-sm text-info align-text-top mr-2`}
      />
      {txs &&
        txs.map((tx, key) => {
          return <FpwrMintTx key={key} tx={tx} />;
        })}
      {false && !txs && <>No transactions yet reported. Report one!</>}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
