import React, { useEffect, useState } from 'react';
import { cvToString, hexToCV } from '@stacks/transactions';
import { concatTransaction, getTxId } from '../lib/btcTransactions';
import { Amount } from './Amount';
export function FpwrMintTx({ tx }) {
  const [valueForPool, setValueForPool] = useState();
  const [valueForPoolInStx, setValueForPoolInStx] = useState();
  const [blockHeight, setBlockHeight] = useState();
  const [txId, setTxId] = useState();
  useEffect(() => {
    const height = hexToCV(tx.contract_call.function_args[0].hex).data.height.value.toString(10);
    const txPartsCV = hexToCV(tx.contract_call.function_args[1].hex);

    setBlockHeight(height);
    const resultCV = hexToCV(tx.tx_result.hex);
    setValueForPool(resultCV.value.data.value.value);
    setValueForPoolInStx(resultCV.value.data.ustx.value);
    concatTransaction(txPartsCV).then(txBuff => {
      getTxId(txBuff).then(txId => setTxId(cvToString(txId)));
    });
  }, [tx]);
  return (
    <div className="p-2 card list-item">
      {txId && (
        <a href={`https://live.blockcypher.com/btc/tx/${txId.substr(2)}/`}>{txId}</a>
      )}
      {!txId && (
        <div
          role="status"
          className="spinner-border spinner-border-sm text-info align-text-top mr-2"
        />
      )}
      <ul>
        <li>
          Stacks Block:{' '}
          <a
            href={`https://stacks-node-api.mainnet.stacks.co/extended/v1/block/by_height/${blockHeight}`}
          >
            {blockHeight}
          </a>
        </li>
        {valueForPool && (
          <li>
            Value of rewards:{' '}
            {valueForPool.toNumber().toLocaleString(undefined, {
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{' '}
            sats
          </li>
        )}
        {valueForPoolInStx && (
          <li>
            Value based on Oracle's price: <Amount ustx={valueForPoolInStx} />
          </li>
        )}
      </ul>
    </div>
  );
}
