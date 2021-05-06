import React, { useRef, useState, useEffect } from 'react';

import { accountsApi, authOrigin, NETWORK } from '../lib/constants';
import { TxStatus } from '../lib/transactions';
import { fetchAccount } from '../lib/account';
import { useConnect as useStacksJsConnect } from '@stacks/connect-react';
import {
  bufferCV,
  ClarityType,
  contractPrincipalCV,
  cvToString,
  noneCV,
  PostConditionMode,
  someCV,
  standardPrincipalCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import * as c32 from 'c32check';
import { poxAddrCV, poxAddrCVFromBitcoin } from '../lib/pools-utils';
import PoolInfo from './PoolInfo';
import { getPoolContractId } from '../lib/pools';

function getPayout(pool) {
  switch (pool.data.payout.data) {
    case 'BTC':
      return 'BTC';
    case 'STX':
      return 'STX';
    default:
      return undefined;
  }
}

function getPayoutAddress(payout, stxAddress) {
  console.log({ payout, stxAddress });
  if (!stxAddress) return undefined;
  switch (payout) {
    case 'BTC':
      return c32.c32ToB58(stxAddress);
    case 'STX':
      return stxAddress;
    default:
      return stxAddress;
  }
}

function getPayoutAddressCV(payout, address) {
  switch (payout) {
    case 'BTC':
      return poxAddrCVFromBitcoin(address);
    case 'STX':
      return poxAddrCV(address);
    default:
      return tupleCV({
        hashbytes: bufferCV(Buffer.from([0])),
        version: bufferCV(Buffer.from([0])),
      });
  }
}

export function PoolJoin({ pool, ownerStxAddress, userSession }) {
  console.log(pool);
  console.log({ ownerStxAddress, userSession });
  const { doContractCall } = useStacksJsConnect();
  const amount = useRef();
  const duration = useRef();
  const payoutAddress = useRef();
  const lockingPeriod = useRef();

  const spinner = useRef();
  const [status, setStatus] = useState();
  const [txId, setTxId] = useState();
  const [stxBalance, setStxBalance] = useState();

  useEffect(() => {
    if (ownerStxAddress) {
      fetchAccount(ownerStxAddress)
        .catch(e => {
          setStatus('Failed to access your account', e);
          console.log(e);
        })
        .then(async acc => {
          setStatus(undefined);
          console.log({ acc });
        });
      accountsApi.getAccountBalance({ principal: ownerStxAddress }).then(balance => {
        const stxBalance = (parseInt(balance.stx.balance) - parseInt(balance.stx.locked)) / 1000000;
        if (amount.current) {
          amount.current.value = stxBalance;
        }
      });
    }
  }, [ownerStxAddress]);

  const isSimple = pool.data.contract.type === ClarityType.OptionalSome;
  const isExt = pool.data["extended-contract"].type === ClarityType.OptionalSome;
  const isExt2 = pool.data["extended2-contract"].type === ClarityType.OptionalSome;
  const contractId = getPoolContractId(pool);
  const [contractAddress, contractName] = contractId.split('.');
  const delegatee = cvToString(pool.data.delegatee);
  const parts = delegatee.split('.');
  const delegateeCV =
    parts.length < 2 ? standardPrincipalCV(parts[0]) : contractPrincipalCV(parts[0], parts[1]);
  const rewardBtcAddressCV = someCV(pool.data['pox-address']);
  const payout = getPayout(pool);
  const userPayoutAddress = getPayoutAddress(payout, ownerStxAddress);

  console.log({ poolData: pool.data });

  const joinAction = async () => {
    spinner.current.classList.remove('d-none');

    const amountCV = uintCV(amount.current.value.trim() * 1000000); // convert to uSTX
    const durationCV = duration.current.value.trim()
      ? someCV(uintCV(duration.current.value.trim()))
      : noneCV();
    const payoutAddressCV = getPayoutAddressCV(payout, payoutAddress.current.value.trim());
    const lockingPeriodCV = uintCV(lockingPeriod.current.value.trim);
    try {
      setStatus(`Sending transaction`);
      const functionArgs = isSimple
        ? [amountCV, delegateeCV, durationCV, rewardBtcAddressCV]
        : [amountCV, delegateeCV, durationCV, rewardBtcAddressCV, payoutAddressCV, lockingPeriodCV];
      console.log({ functionArgs });
      await doContractCall({
        contractAddress,
        contractName,
        functionName: 'delegate-stx',
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        userSession,
        network: NETWORK,
        finished: data => {
          console.log(data);
          setStatus(undefined);
          setTxId(data.txId);
          spinner.current.classList.add('d-none');
        },
      });
    } catch (e) {
      console.log(e);
      setStatus(e.toString());
      spinner.current.classList.add('d-none');
    }
  };

  return (
    <div>
      <h5>Join the pool</h5>
      <PoolInfo pool={pool} />
      <div className="NoteField">
        Choose an amount, how much you would like to "delegately" stack through this pool (can be
        higher than your balance to compound future rewards if stacking indefinitely).
        <input
          type="number"
          step="any"
          min="0"
          ref={amount}
          className="form-control"
          placeholder="Amount in STX"
          onKeyUp={e => {
            if (e.key === 'Enter') duration.current.focus();
          }}
          onBlur={e => {
            setStatus(undefined);
          }}
        />
        <br />
        Duration of your pool membership
        <input
          type="text"
          ref={duration}
          className="form-control"
          placeholder="Leave empty for indefinite duration"
          onKeyUp={e => {
            if (e.key === 'Enter') lockingPeriod.current.focus();
          }}
          onBlur={e => {
            setStatus(undefined);
          }}
        />
        <br />
        Locking Period (how long do you want to swim this time?)
        <input
          type="text"
          ref={lockingPeriod}
          className="form-control"
          placeholder="Number of cycles"
          disabled={isSimple}
          readOnly={pool && pool.data['locking-period'].type === ClarityType.List}
          defaultValue={
            pool && pool.data['locking-period'].type === ClarityType.List
              ? pool.data['locking-period'].list.map(lp => lp.value.toString(10)).join(' - ')
              : ''
          }
          onKeyUp={e => {
            if (e.key === 'Enter') payoutAddress.current.focus();
          }}
          onBlur={e => {
            setStatus(undefined);
          }}
        />
        <br />
        Payout address (how would you like to get your rewards)
        <input
          type="text"
          ref={payoutAddress}
          className="form-control"
          defaultValue={userPayoutAddress}
          disabled={isSimple}
          onKeyUp={e => {
            if (e.key === 'Enter') joinAction();
          }}
          onBlur={e => {
            setStatus(undefined);
          }}
        />
        <br />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" onClick={joinAction}>
            <div
              ref={spinner}
              role="status"
              className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
            />
            Delegate
          </button>
        </div>
      </div>
      <div>
        <TxStatus txId={txId} resultPrefix="You joined the pool " />
      </div>
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
