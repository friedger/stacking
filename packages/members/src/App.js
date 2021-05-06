import React, { useEffect, useState, useRef } from 'react';
import Landing from './pages/Landing';
import { Connect } from '@stacks/connect-react';
import { FRIEDGER_POOL_NFT, NETWORK } from './lib/constants';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import { useConnect as useStacksJsConnect } from '@stacks/connect-react';
import { PostConditionMode, uintCV } from '@stacks/transactions';

export default function App(props) {
  const { authOptions } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [, setUserData] = useAtom(userDataState);
  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

  return (
    <Connect authOptions={authOptions}>
      <Auth userSession={userSession} />
      <Content userSession={userSession} />
    </Connect>
  );
}

function Content({ userSession }) {
  const authenticated = userSession && userSession.isUserSignedIn();
  const decentralizedID =
    userSession && userSession.isUserSignedIn() && userSession.loadUserData().decentralizedID;
  const [status, setStatus] = useState();
  const [txId, setTxId] = useState();
  const amount = useRef();
  const receiver = useRef();

  const { doContractCall } = useStacksJsConnect();

  const claimNFT = async () => {
    try {
      setStatus(`Sending transaction`);
      await doContractCall({
        contractAddress: FRIEDGER_POOL_NFT.address,
        contractName: FRIEDGER_POOL_NFT.name,
        functionName: 'claim',
        functionArgs: [uintCV(amount.current.value.trim())],
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
  const changeRewardReceiver = () => {};
  return (
    <>
      {!authenticated && <Landing />}
      {decentralizedID && (
        <div>
          <section>
            <h5>Claim Friedger Pool NFT</h5>
            Pay what you want (to Friedger)
            <div>
              <input ref={amount} placeholder="5 STX" />
              <button className="read_more" onClick={claimNFT}>
                Claim
              </button>
            </div>
          </section>
          <section>
            <h5>Change reward receiver</h5>
            Enter the Stacks address that the pool admin should use for your reward payout.
            <div>
              <input ref={receiver} placeholder="SP1234.." />
              <button className="read_more" onClick={changeRewardReceiver}>
                Submit
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
