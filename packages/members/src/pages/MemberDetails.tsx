import {
  UserSession,
  showSignMessage,
  useConnect as useStacksJsConnect,
} from '@stacks/connect-react';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { StackerInfo, StackingClient } from '@stacks/stacking';
import {
  AddressVersion,
  ClarityType,
  ClarityValue,
  FungibleConditionCode,
  PostConditionMode,
  ResponseOkCV,
  SomeCV,
  callReadOnlyFunction,
  createStacksPublicKey,
  cvToHex,
  cvToString,
  hexToCV,
  makeStandardSTXPostCondition,
  principalCV,
  publicKeyToAddress,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import { useEffect, useRef, useState } from 'react';
import { Address } from '../components/Address';
import DelegateAction from '../components/DelegateAction';
import { DelegationState } from '../components/DelegationState';
import { PayoutState } from '../components/PayoutState';
import { StackingStatus } from '../components/StackingStatus';
import {
  FRIEDGER_POOL_HINTS,
  FRIEDGER_POOL_NFT,
  FRIEDGER_POOL_XBTC,
  NETWORK,
  namesApi,
  smartContractsApi,
} from '../lib/constants';
import { initialMembers } from '../lib/memberlist.ts';
import { fetchDelegationState } from '../lib/stackingState.ts';
import { fastPoolContract, multiPoolContract } from '../lib/delegation.ts';

export const MemberDetails = ({
  stxAddressToShow,
  stxAddress,
  userSession,
}: {
  stxAddressToShow: string;
  stxAddress: string;
  userSession: UserSession;
}) => {
  const authenticated = userSession.isUserSignedIn();
  const [status, setStatus] = useState<string>();
  const [, setTxId] = useState<string>();
  const [stackingStatus, setStackingStatus] = useState<StackerInfo>();
  const [currentReceiver, setCurrentReceiver] = useState<string>();
  const [claimableNftOwner, setClaimableNftOwner] = useState<string>();
  const [delegationState, setDelegationState] = useState<{ state: undefined | ClarityValue }>();
  const [, setPayoutState] = useState<{ xbtc: boolean }>();
  const amountRef = useRef<HTMLInputElement>(null);
  const receiverRef = useRef<HTMLInputElement>(null);
  const signatureRef = useRef<HTMLTextAreaElement>(null);
  const signatureResultRef = useRef<HTMLTextAreaElement>(null);

  const { doContractCall } = useStacksJsConnect();
  const claimableNftIndex = initialMembers.findIndex(m => m === stxAddressToShow);

  useEffect(() => {
    if (stxAddressToShow) {
      const client = new StackingClient(stxAddressToShow, NETWORK);
      client.getStatus().then(s => {
        setStackingStatus(s);
      });
      fetchDelegationState(stxAddressToShow).then(result => {
        setDelegationState(result);
      });
      if (claimableNftIndex >= 0) {
        callReadOnlyFunction({
          contractAddress: FRIEDGER_POOL_NFT.address,
          contractName: FRIEDGER_POOL_NFT.name,
          functionName: 'get-owner',
          functionArgs: [uintCV(claimableNftIndex + 1)], // nft index + 1 = nft id
          senderAddress: FRIEDGER_POOL_NFT.address,
        }).then(getOwnerResult => {
          // result is always ResponseOk
          const result = getOwnerResult as ResponseOkCV;
          // and response value type is (optional principal)
          if (result.value.type === ClarityType.OptionalSome) {
            setClaimableNftOwner(cvToString(result.value.value));
          }
        });
      }
      smartContractsApi
        .getContractDataMapEntry({
          contractAddress: FRIEDGER_POOL_HINTS.address,
          contractName: FRIEDGER_POOL_HINTS.name,
          mapName: 'payout-map',
          key: cvToHex(principalCV(stxAddressToShow)),
        })
        .then(response => {
          console.log(response);
          if (response.data !== '0x09') {
            const cv = hexToCV(response.data) as SomeCV;
            setCurrentReceiver(cvToString(cv.value));
          }
        });

      smartContractsApi
        .getContractDataMapEntry({
          contractAddress: FRIEDGER_POOL_XBTC.address,
          contractName: FRIEDGER_POOL_XBTC.name,
          mapName: 'xbtc-rewards',
          key: cvToHex(standardPrincipalCV(stxAddressToShow)),
        })
        .then(response => {
          console.log(response);
          if (response.data !== '0x09') {
            const cv = hexToCV(response.data) as SomeCV;
            console.log({ cvValue: cv.value });
            setPayoutState({ xbtc: cv.value.type === ClarityType.BoolTrue });
          } else {
            setPayoutState({ xbtc: false });
          }
        });
    }
  }, [stxAddressToShow, claimableNftIndex]);

  const claimNFT = async () => {
    try {
      setStatus(`Sending transaction`);
      const amount = parseInt(amountRef.current?.value.trim() || '');
      await doContractCall({
        contractAddress: FRIEDGER_POOL_NFT.address,
        contractName: FRIEDGER_POOL_NFT.name,
        functionName: 'claim',
        functionArgs: [uintCV(amount)], // amount in stx
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardSTXPostCondition(
            stxAddressToShow,
            FungibleConditionCode.Equal,
            amount * 1_000_000 // amount in ustx
          ),
        ],
        userSession,
        network: NETWORK,
        onFinish: data => {
          console.log(data);
          setStatus(undefined);
          setTxId(data.txId);
        },
      });
    } catch (e: any) {
      console.log(e);
      setStatus(e.toString());
    }
  };

  const changeRewardReceiver = async () => {
    try {
      setStatus(`Sending transaction`);
      let receiver = receiverRef.current?.value.trim();
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

      await doContractCall({
        contractAddress: FRIEDGER_POOL_HINTS.address,
        contractName: FRIEDGER_POOL_HINTS.name,
        functionName: 'set-payout-recipient',
        functionArgs: [principalCV(receiver)],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        userSession,
        network: NETWORK,
        onFinish: data => {
          console.log(data);
          setStatus(undefined);
          setTxId(data.txId);
        },
      });
    } catch (e: any) {
      console.log(e);
      setStatus(e.toString());
    }
  };

  const changeRewardReceiverBySignature = () => {
    const message = signatureRef.current?.value.trim() || 'I own this address';
    showSignMessage({
      message,
      network: NETWORK,
      onFinish: data => {
        signatureResultRef.current!.value = JSON.stringify({
          message: message,
          signature: data.signature,
          publicKey: data.publicKey,
        });
      },
    });
  };

  const verify = () => {
    const {
      message,
      signature,
      publicKey,
    }: { message: string; signature: string; publicKey: string } = JSON.parse(
      signatureResultRef.current?.value || ''
    );
    console.log({ signature, message, publicKey });
    const valid = verifyMessageSignatureRsv({ signature, message, publicKey });
    setStatus(
      valid
        ? `Signature is valid from ${publicKeyToAddress(AddressVersion.MainnetSingleSig, createStacksPublicKey(publicKey))}`
        : 'Signature is NOT valid'
    );
  };

  return (
    <>
      <section>
        <h4>
          Your Membership {stxAddress !== stxAddressToShow && <Address addr={stxAddressToShow} />}
        </h4>
        <StackingStatus stackingStatus={stackingStatus} />
        <br />
        <DelegationState delegationState={delegationState} />
        <br />
        <br />
        {authenticated && stxAddress === stxAddressToShow && (
          <>
            <h4>Delegate STX to Fast Pool (pool is full)</h4>
            <DelegateAction address={stxAddress} poolContract={fastPoolContract} />
            <br />
            <PayoutState payoutState={false} />
            <br />
            <br />
            <h4>Delegate STX to Multi Pool</h4>
            <DelegateAction address={stxAddress} poolContract={multiPoolContract} />
            <br />
            <br />
            <h4>Friedger Pool NFT</h4>
            <img width="150px" src="/nft-preview.webp" alt="" />
            <br />
            Limited 375 NFT collection deployed below 10k Stacks blocks with Ordinal #65685
            inscribed on Bitcoin.
            <br />
            {!claimableNftOwner && claimableNftIndex >= 0 && (
              <>
                Pay what you want (to Friedger in STX)
                <div>
                  <input ref={amountRef} defaultValue={10} placeholder={`${10} STX`} />
                  <button className="btn btn-outline-primary" type="button" onClick={claimNFT}>
                    Claim and Pay
                  </button>
                </div>
              </>
            )}
            {claimableNftOwner && (
              <>
                Your Friedger Pool NFT is owned by{' '}
                {claimableNftOwner === stxAddressToShow ? 'you' : claimableNftOwner}.
              </>
            )}
            {claimableNftIndex < 0 && (
              <>
                Only pool members of cycle #3 and #4 are eligible to claim the{' '}
                <a href="https://gamma.io/collections/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.friedger-pool-nft">
                  Friedger Pool NFT.
                </a>
              </>
            )}
            <br />
            <br />
            <br />
            <h4>Change reward receiver</h4>
            Where should the pool admin send your rewards to? <br />
            Enter a Stacks address or name:
            <div>
              <input ref={receiverRef} defaultValue={currentReceiver} placeholder="SP1234.." />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={changeRewardReceiver}
              >
                Submit
              </button>
            </div>
            <br />
            <br />
            <h4>Change reward receiver by signature</h4>
            <div>
              <textarea
                ref={signatureRef}
                defaultValue={`My rewards should be sent to my stx address`}
              />
              <br />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={changeRewardReceiverBySignature}
              >
                Sign
              </button>
              <br />
              Signature
              <br />
              <textarea ref={signatureResultRef} />
              <br />
              <button className="btn btn-outline-primary" type="button" onClick={verify}>
                Verify
              </button>
            </div>
          </>
        )}
        {status && <div>{status}</div>}
      </section>
    </>
  );
};
