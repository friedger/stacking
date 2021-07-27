import { cvToString, PostConditionMode } from '@stacks/connect/node_modules/@stacks/transactions';
import { useRef, useState } from 'react';
import { paramsFromTx, wasTxMined } from '../lib/btcTransactions';
import { useConnect as useStacksJsConnect } from '@stacks/connect-react';
import { FPWR_CONTRACT, NETWORK } from '../lib/constants';
import { AnchorMode } from '@stacks/transactions';
import { TxStatus } from './TxStatus';

export function SubmitRewardTx({ userSession }) {
  const { doContractCall } = useStacksJsConnect();

  const txidRef = useRef();
  const [txid, setTxid] = useState();
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(true);

  const verifyAction = async () => {
    const btcTxId = txidRef.current.value.trim();
    const { txCV, proofCV, block, blockCV, headerPartsCV } = await paramsFromTx(btcTxId);
    console.log({
      btcTxId,
      block,
      proofCV: cvToString(proofCV),
      blockCV: cvToString(blockCV),
      txCV: cvToString(txCV),
    });
    const results = await Promise.all([wasTxMined(headerPartsCV, txCV, proofCV)]);
    console.log({ r: results.map(r => cvToString(r)) });
    setChanged(false);
  };

  const submitAction = async () => {
    setLoading(true);

    const btcTxId = txidRef.current.value.trim();
    const { txPartsCV, proofCV, headerPartsCV } = await paramsFromTx(btcTxId);

    const functionArgs = [
      // block
      headerPartsCV,
      // tx
      txPartsCV,
      // proof
      proofCV,
    ];
    try {
      // submit
      await doContractCall({
        contractAddress: FPWR_CONTRACT.address,
        contractName: FPWR_CONTRACT.name,
        functionName: 'mint',
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        userSession,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        onCancel: () => {
          setLoading(false);
        },
        onFinish: result => {
          setLoading(false);
          setTxid(result.txId);
        },
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <>
      <input ref={txidRef} model={txid} placeholder="0x12345" />
      <button
        className="btn btn-outline-primary"
        type="button"
        onClick={changed ? verifyAction : submitAction}
      >
        <div
          role="status"
          className={`${
            loading ? '' : 'd-none'
          } spinner-border spinner-border-sm text-info align-text-top mr-2`}
        />
        {changed ? 'Verify' : 'Submit'}
      </button>
      {txid && <TxStatus txId={txid} />}
    </>
  );
}
