import React, { useState, useEffect, useCallback, useRef } from 'react';
import { namesApi, NETWORK } from '../lib/constants';
import { fetchDepot, fetchDepotBalance, fetchTokenBalance } from '../lib/wrappedRewards';
import { useConnect as useStacksJsConnect } from '@stacks/connect-react';
import {
  AnchorMode,
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  PostConditionMode,
} from '@stacks/transactions';
import { TxStatus } from './TxStatus';
import { AmountBTC, tokenAmountToNumber } from './Amount';

export function ClaimRewards({
  userSession,
  stxOwnerAddress,
  cycle,
  tokenContract,
  depotContract,
}) {
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [txs, setTxs] = useState();
  const [txid, setTxid] = useState();
  const [depotValue, setDepotValue] = useState();
  const [depotBalance, setDepotBalance] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [stxAddress, setStxAddress] = useState();
  const stxAddressRef = useRef();

  const { doContractCall } = useStacksJsConnect();

  const fetchBalances = useCallback(
    async stxAddress => {
      let [addressOrName, namespace] = stxAddress.split('.');
      if (namespace) {
        try {
          const info = await namesApi.getNameInfo({ name: stxAddress });
          console.log({ info });
          if (info) {
            addressOrName = info.address;
          }
        } catch (e) {
          console.log(e);
        }
      }
      fetchDepotBalance(addressOrName, depotContract).then(response => {
        console.log({ depotBalance: response });
        setDepotBalance(response ? tokenAmountToNumber(response.value) : null);
      });
      fetchTokenBalance(addressOrName, tokenContract).then(response => {
        console.log({ tokenBalance: response }, tokenContract);
        setTokenBalance(response ? tokenAmountToNumber(response) : null);
      });
    },
    [depotContract, tokenContract]
  );

  useEffect(() => {
    setLoading(true);
    fetchDepot(depotContract).then(response => {
      setDepotValue(response);
    });
    if (stxOwnerAddress) {
      fetchBalances(stxOwnerAddress, depotContract, tokenContract);
    } else {
      const address = new URLSearchParams(window.location.search).get('address');
      if (address) {
        fetchBalances(address, depotContract, tokenContract);
      }
    }
  }, [stxOwnerAddress, depotContract, tokenContract, fetchBalances]);

  const claimAction = async () => {
    setLoading(true);

    try {
      // submit
      await doContractCall({
        contractAddress: depotContract.address,
        contractName: depotContract.name,
        functionName: 'claim',
        functionArgs: [],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeContractFungiblePostCondition(
            depotContract.address,
            depotContract.name,
            FungibleConditionCode.GreaterEqual,
            new BN(0),
            createAssetInfo(tokenContract.address, tokenContract.name, 'wrapped-rewards')
          ),
        ],
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
    <div>
      <h5 className="mt-2">Cycle #{cycle}</h5>
      {depotValue && (
        <div className="container">
          <div className="row">
            <div className="col">
              {cycle === 13 ? <>Total verified on-chain</> : <>Total rewards</>}:
            </div>
            <div className="col">
              {' '}
              {depotValue.data['tokens'].value.value.toNumber() / 100_000_000}
            </div>
          </div>
          <div className="row">
            <div className="col">Total claimed:</div>
            <div className="col">
              {' '}
              {depotValue.data['total-claimed'].value.toNumber() / 100_000_000}
            </div>
          </div>
          <div className="row">
            <div className="col">Total payout</div>
            <div className="col">
              {depotValue.data['total-rewards'].value.toNumber() / 100_000_000}
            </div>
          </div>
        </div>
      )}
      <br />
      {!stxOwnerAddress && (
        <div>
          Check wrapped rewards for address:{' '}
          <input
            ref={stxAddressRef}
            model={stxAddress}
            placeholder="SP1234.."
            defaultValue={new URLSearchParams(window.location.search).get('address')}
          />
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => {
              fetchBalances(stxAddressRef.current.value);
            }}
          >
            Submit
          </button>
        </div>
      )}
      {cycle === 13 ? (
        <>
          1.68265349 wrapped rewards have been minted through verified BTC rewards transactions.
          Unfortunately, they are locked in the buggy depot contract. They can't be claimed.
          <br />
          {depotBalance ? (
            <>
              Your balance for cycle #13 would be:{' '}
              <AmountBTC sats={depotBalance} tokenSymbol="FPWR-v03" />
            </>
          ) : (
            <>
              <br />
            </>
          )}
        </>
      ) : (
        <>
          {tokenBalance ? (
            <>
              Your balance of wrapped reward tokens is:{' '}
              <AmountBTC sats={tokenBalance} tokenSymbol="FPWR-v04" />
              <br />
            </>
          ) : (
            <>
              Your have no wrapped reward tokens.
              <br />
            </>
          )}
          {depotBalance ? (
            <>
              Your balance of claimable rewards is:{' '}
              <AmountBTC sats={depotBalance} tokenSymbol="FPWR-v04" />
              {depotBalance > 0 && (
                <>
                  <br />
                  <button className="btn btn-outline-primary" type="button" onClick={claimAction}>
                    <div
                      role="status"
                      className={`${
                        loading ? '' : 'd-none'
                      } spinner-border spinner-border-sm text-info align-text-top mr-2`}
                    />
                    Claim
                  </button>

                  {txid && <TxStatus txId={txid} />}
                </>
              )}
            </>
          ) : (
            'No tokens to claim.'
          )}
        </>
      )}
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
