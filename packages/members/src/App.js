import React, { useEffect, useState, useRef } from 'react';
import Landing from './pages/Landing';
import { Connect } from '@stacks/connect-react';
import {
  FRIEDGER_POOL_HINTS,
  FRIEDGER_POOL_NFT,
  FRIEDGER_POOL_XBTC,
  namesApi,
  NETWORK,
  smartContractsApi,
} from './lib/constants';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnect } from './lib/auth';
import { useAtom } from 'jotai';
import { useConnect as useStacksJsConnect } from '@stacks/connect-react';
import {
  callReadOnlyFunction,
  ClarityType,
  contractPrincipalCV,
  cvToHex,
  cvToString,
  falseCV,
  FungibleConditionCode,
  hexToCV,
  makeStandardSTXPostCondition,
  PostConditionMode,
  standardPrincipalCV,
  trueCV,
  uintCV,
} from '@stacks/transactions';
import { initialMembers } from './lib/memberlist';
import { StackingClient } from '@stacks/stacking';
import { Address } from './components/Address';
import Jdenticon from 'react-jdenticon';
import BN from 'bn.js';
import { fetchDelegationState } from './lib/stackingState';
import { DelegationState } from './components/DelegationState';
import { StackingStatus } from './components/StackingStatus';
import { PayoutState } from './components/PayoutState';

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
      <h1>Members' Area</h1>
      <div style={{ display: 'flex', justifyContent: 'right' }}>
        {stxAddress && (
          <>
            <div>
              <Jdenticon size="50" value={stxAddress} />
            </div>
            <div>
              <Address addr={stxAddress} />
              <br />
              <Auth userSession={userSession} />
            </div>
          </>
        )}
      </div>
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
  const [currentReceiver, setCurrentReceiver] = useState();
  const [claimableNftOwner, setClaimableNftOwner] = useState();
  const [delegationState, setDelegationState] = useState();
  const [payoutState, setPayoutState] = useState();
  const amountRef = useRef();
  const receiverRef = useRef();
  const rewardCurrencyXbtcRef = useRef();
  const rewardCurrencyStxRef = useRef();

  const { doContractCall } = useStacksJsConnect();
  const claimableNftIndex = initialMembers.findIndex(m => m === stxOwnerAddress);

  useEffect(() => {
    if (stxOwnerAddress) {
      const client = new StackingClient(stxOwnerAddress, NETWORK);
      client.getStatus().then(s => {
        setStackingStatus(s);
        if (s.stacked) {
          setSuggestedAmount(Math.max(10, Math.floor(s.details.amount_microstx / 2_000_000_000))); // 0.5% * 2 * 5%
        }
      });
      fetchDelegationState(stxOwnerAddress).then(result => {
        setDelegationState(result);
      });
      if (claimableNftIndex >= 0) {
        callReadOnlyFunction({
          contractAddress: FRIEDGER_POOL_NFT.address,
          contractName: FRIEDGER_POOL_NFT.name,
          functionName: 'get-owner',
          functionArgs: [uintCV(claimableNftIndex)],
        }).then(getOwnerResult => {
          // result is always ResponseOk
          // and response value type is (optional principal)
          if (getOwnerResult.value.type === ClarityType.OptionalSome) {
            setClaimableNftOwner(cvToString(getOwnerResult.value.value));
          }
        });
      }
      smartContractsApi
        .getContractDataMapEntry({
          contractAddress: FRIEDGER_POOL_HINTS.address,
          contractName: FRIEDGER_POOL_HINTS.name,
          mapName: 'payout-map',
          key: cvToHex(standardPrincipalCV(stxOwnerAddress)),
        })
        .then(response => {
          console.log(response);
          if (response.data !== '0x09') {
            const cv = hexToCV(response.data);
            setCurrentReceiver(cvToString(cv.value));
          }
        });

      smartContractsApi
        .getContractDataMapEntry({
          contractAddress: FRIEDGER_POOL_XBTC.address,
          contractName: FRIEDGER_POOL_XBTC.name,
          mapName: 'xbtc-rewards',
          key: cvToHex(standardPrincipalCV(stxOwnerAddress)),
        })
        .then(response => {
          console.log(response);
          if (response.data !== '0x09') {
            const cv = hexToCV(response.data);
            console.log({ cvValue: cv.value });
            setPayoutState({ xbtc: cv.value.type === ClarityType.BoolTrue });
          } else {
            setPayoutState({ xbtc: false });
          }
        });
    }
  }, [stxOwnerAddress, claimableNftIndex]);

  const claimNFT = async () => {
    try {
      setStatus(`Sending transaction`);
      const amount = parseInt(amountRef.current.value.trim());
      await doContractCall({
        contractAddress: FRIEDGER_POOL_NFT.address,
        contractName: FRIEDGER_POOL_NFT.name,
        functionName: 'claim',
        functionArgs: [uintCV(amount)],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardSTXPostCondition(
            stxOwnerAddress,
            FungibleConditionCode.Equal,
            new BN(amount * 1000000)
          ),
        ],
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
      let receiver = receiverRef.current.value.trim();
      if (!receiver) {
        setStatus('Enter receiver of your rewards');
        return;
      }
      // replace name with address
      setStatus(`Sending transaction, checking name`);
      const nameInfo = await namesApi
        .getNameInfo({ name: receiver })
        .then(r => {
          setStatus(`Sending transaction, using ${r.address}`);
          return r;
        })
        .catch(e => {
          console.log(e);
          return {
            address: receiver,
          };
        });
      console.log({ nameInfo });
      if (nameInfo.address) {
        receiver = nameInfo.address;
      }
      // convert to clarity value
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

  const changeRewardCurrency = async () => {
    try {
      setStatus(`Sending transaction`);
      const rewardsInXbtc = rewardCurrencyXbtcRef.current.checked;
      console.log(rewardCurrencyXbtcRef.current.checked, rewardCurrencyStxRef.current.checked);
      await doContractCall({
        contractAddress: FRIEDGER_POOL_XBTC.address,
        contractName: FRIEDGER_POOL_XBTC.name,
        functionName: 'set-distribution-in-xbtc',
        functionArgs: [rewardsInXbtc ? trueCV() : falseCV()],
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
            <h4>Your Membership</h4>
            <StackingStatus stackingStatus={stackingStatus} />
            <br />
            <DelegationState delegationState={delegationState} />
            <br />
            <PayoutState payoutState={payoutState} />
            <br />
            <br />
            <h4>Friedger Pool NFT</h4>
            <img width="150px" src="/nft-preview.webp" alt="" />
            <br />
            {!claimableNftOwner && claimableNftIndex >= 0 && (
              <>
                Pay what you want (to Friedger in STX)
                <div>
                  <input
                    ref={amountRef}
                    defaultValue={suggestedAmount}
                    placeholder={`${suggestedAmount} STX`}
                  />
                  <button className="btn btn-outline-primary" type="button" onClick={claimNFT}>
                    Claim and Pay
                  </button>
                </div>
              </>
            )}
            {claimableNftOwner && (
              <>
                Your Friedger Pool NFT is owned by{' '}
                {claimableNftOwner === stxOwnerAddress ? 'you' : claimableNftOwner}.
              </>
            )}
            {claimableNftIndex < 0 && (
              <>Only pool members of cycle #3 and #4 are eligible to claim the Friedger Pool NFT.</>
            )}
            <br />
            <br />
            <h4>Change reward settings</h4>
            Would you like to receive rewards in xBTC?
            <div>
              <input
                type="radio"
                id="xbtc"
                name="rewards_currency"
                value="yes"
                ref={rewardCurrencyXbtcRef}
              />
              <label htmlFor="xbtc">Yes, in xBTC.</label>
              <br />
              <input
                type="radio"
                id="stx"
                name="rewards_currency"
                value="no"
                ref={rewardCurrencyStxRef}
              />
              <label htmlFor="stx">No, in STX.</label>
              <br />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={changeRewardCurrency}
              >
                Submit
              </button>
            </div>
            <br />
            <h4>Change reward receiver</h4>
            Where should the pool admin send your rewards to? <br />
            Enter a Stacks address or name:
            <div>
              <input ref={receiverRef} model={currentReceiver} placeholder="SP1234.." />
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
