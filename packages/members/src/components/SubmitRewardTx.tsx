import { useRef, useState } from 'react';
import {
  getReversedTxId,
  paramsFromTx,
  parseBlockHeader,
  verifyBlockHeader,
  verifyBlockHeader2,
  verifyMerkleProof,
  verifyMerkleProof2,
  wasTxMined,
  wasTxMinedFromHex,
} from '../lib/btcTransactions';
import { useConnect as useStacksJsConnect } from '@stacks/connect-react';
import { FPWR_03_CONTRACT, NETWORK } from '../lib/constants';
import { AnchorMode, cvToString, PostConditionMode } from '@stacks/transactions';
import { TxStatus } from './TxStatus';
import { wasSubmitted } from '../lib/wrappedRewards';

export function SubmitRewardTx({ userSession }) {
  const { doContractCall } = useStacksJsConnect();

  const txidRef = useRef();
  const [txid, setTxid] = useState();
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(true);
  const [verifyResult, setVerifyResult] = useState();

  const verifyAction = async () => {
    setLoading(true);
    const btcTxId = txidRef.current.value.trim();

    const { txCV, proofCV, block, blockCV, headerPartsCV, header, headerParts, stxHeight } =
      await paramsFromTx(btcTxId);
    console.log({
      btcTxId,
      block,
      proofCV: cvToString(proofCV),
      blockCV: cvToString(blockCV),
      txCV: cvToString(txCV),
      stxHeight,
    });
    const alreadyDone = await wasSubmitted(txCV);
    if (alreadyDone) {
      setVerifyResult('already submitted');
      return;
    }
    const results = await Promise.all([
      /* getReversedTxId(txCV),
      verifyMerkleProof(btcTxId, block, proofCV),
      verifyMerkleProof2(txCV, headerPartsCV, proofCV),
      verifyBlockHeader(headerParts, stxHeight),
      verifyBlockHeader2(blockCV),
      wasTxMinedFromHex(blockCV, txCV, proofCV),
      parseBlockHeader(header),*/
      wasTxMined(headerPartsCV, txCV, proofCV),
    ]);
    console.log({ r: results.map(r => cvToString(r)) });
    setVerifyResult(results[results.length - 1]);
    setChanged(false);
    setLoading(false);
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
        contractAddress: FPWR_03_CONTRACT.address,
        contractName: FPWR_03_CONTRACT.name,
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
      <input
        ref={txidRef}
        model={txid}
        onChange={() => setChanged(true)}
        placeholder="tx id in hex like abc12345"
      />
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
      <br />
      {verifyResult && cvToString(verifyResult)}
      {txid && <TxStatus txId={txid} />}
    </>
  );
}
