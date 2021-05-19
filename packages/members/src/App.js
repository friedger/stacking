import React, { useEffect, useState, useRef } from 'react';
import Landing from './pages/Landing';
import { Connect } from '@stacks/connect-react';
import { FRIEDGER_POOL_HINTS, FRIEDGER_POOL_NFT, NETWORK } from './lib/constants';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import { useConnect as useStacksJsConnect } from '@stacks/connect-react';
import {
  contractPrincipalCV,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import { initialMembers } from './lib/memberlist';
import { StackingClient } from '@stacks/stacking';
import { Amount } from './components/Amount';
import { Address } from './components/Address';
import { toSvg } from 'jdenticon';

export default function App(props) {
  const { authOptions } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [userData, setUserData] = useAtom(userDataState);
  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

  const stxAddress = userData && userData.profile.stxAddress.mainnet;
  return (
    <Connect authOptions={authOptions}>
      <h1>Member Area</h1>
      {stxAddress ? toSvg(stxAddress, 50) : null}
      {stxAddress && (
        <>
          <Address addr={stxAddress} />
          <br />
        </>
      )}
      <Auth userSession={userSession} />
      <Content userSession={userSession} />
    </Connect>
  );
}

function Content({ userSession }) {
  const authenticated = userSession && userSession.isUserSignedIn();
  const userData = authenticated && userSession.loadUserData();
  const decentralizedID = userData && userData.decentralizedID;
  const stxOwnerAddress = userData && userData.profile.stxAddress.mainnet;
  const [status, setStatus] = useState();
  const [, setTxId] = useState();
  const [stackingStatus, setStackingStatus] = useState();
  const [suggestedAmount, setSuggestedAmount] = useState(10);
  const amountRef = useRef();
  const receiverRef = useRef();

  const { doContractCall } = useStacksJsConnect();
  useEffect(() => {
    const client = new StackingClient(stxOwnerAddress, NETWORK);
    client.getStatus().then(s => {
      setStackingStatus(s);
      if (s.stacked) {
        setSuggestedAmount(Math.max(10, Math.floor(s.details.amount_microstx / 2_000_000_000))); // 0.5% * 2 * 5%
      }
    });
  }, [stxOwnerAddress]);
  const claimNFT = async () => {
    try {
      setStatus(`Sending transaction`);
      await doContractCall({
        contractAddress: FRIEDGER_POOL_NFT.address,
        contractName: FRIEDGER_POOL_NFT.name,
        functionName: 'claim',
        functionArgs: [uintCV(amountRef.current.value.trim())],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        userSession,
        network: NETWORK,
        finished: data => {
          console.log(data);
          setStatus(undefined);
          setTxId(data.txId);
        },
      });
    } catch (e) {
      console.log(e);
      setStatus(e.toString());
    }
  };
  const changeRewardReceiver = async () => {
    try {
      setStatus(`Sending transaction`);
      const receiver = receiverRef.current.value.trim();
      if (!receiver) {
        setStatus('Enter receiver of your rewards');
        return;
      }
      const receiverParts = receiver.split('.');
      const receiverCV =
        receiverParts.length === 1
          ? standardPrincipalCV(receiverParts[0])
          : contractPrincipalCV(receiverParts[0], receiverParts[1]);
      await doContractCall({
        contractAddress: FRIEDGER_POOL_HINTS.address,
        contractName: FRIEDGER_POOL_HINTS.name,
        functionName: 'set-payout-recipient',
        functionArgs: [receiverCV],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        userSession,
        network: NETWORK,
        finished: data => {
          console.log(data);
          setStatus(undefined);
          setTxId(data.txId);
        },
      });
    } catch (e) {
      console.log(e);
      setStatus(e.toString());
    }
  };
  return (
    <>
      {!authenticated && <Landing />}
      {decentralizedID && (
        <>
          <section>
            {stackingStatus &&
              (stackingStatus.stacked ? (
                <>
                  You stacked <Amount ustx={stackingStatus.details.amount_microstx} /> until cycle #
                  {stackingStatus.details.first_reward_cycle +
                    stackingStatus.details.locking_period}
                  .
                </>
              ) : (
                <>You are currently not stacking.</>
              ))}
            {initialMembers.findIndex(m => m === stxOwnerAddress) >= 0 && (
              <>
                <h5>Claim Friedger Pool NFT</h5>
                Pay what you want (to Friedger)
                <div>
                  <input ref={amountRef} placeholder={`${suggestedAmount} STX`} />
                  <button className="btn btn-outline-primary" type="button" onClick={claimNFT}>
                    Claim
                  </button>
                </div>
              </>
            )}
            <h5>Change reward receiver</h5>
            Enter the Stacks address that you want the pool admin to use for your reward payout.
            <div>
              <input ref={receiverRef} placeholder="SP1234.." />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={changeRewardReceiver}
              >
                Submit
              </button>
            </div>
            {status && <div>{status}</div>}
          </section>
        </>
      )}
    </>
  );
}
