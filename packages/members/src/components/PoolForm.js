import React, { useRef, useState, useEffect } from 'react';

import {
  CONTRACT_ADDRESS,
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  POOL_REGISTRY_CONTRACT_NAME,
  STACK_API_URL,
} from '../lib/constants';
import { TxStatus } from '../lib/transactions';
import { fetchAccount, getUsername } from '../lib/account';
import { useConnect } from '@stacks/connect-react';
import {
  bufferCVFromString,
  callReadOnlyFunction,
  ClarityType,
  contractPrincipalCV,
  cvToString,
  FungibleConditionCode,
  listCV,
  makeStandardSTXPostCondition,
  noneCV,
  PostConditionMode,
  someCV,
  standardPrincipalCV,
  stringAsciiCV,
  uintCV,
} from '@stacks/transactions';
import * as c32 from 'c32check';
import {
  fetchPool,
  findTraitIndex,
  nameToUsernameCV,
  registerFunctions,
  updateFunctions,
  verifyUrl,
} from '../lib/pools';
import { poxAddrCVFromBitcoin, poxCVToBtcAddress } from '../lib/pools-utils';
import BN from 'bn.js';

const ERR_NAME = 'Name must contain 1 dot.';
const ERR_URL = 'Website url required!';
const ERR_REWARD_ADDRESS_1 = 'At least one reward address required.';
const ERR_INVALID_REWARD_ADDRESSES = 'Invalid Bitcoin address(es).';
const ERR_INVALID_CONTRACT_ID = 'Invalid contract id.';
const ERR_LOCKING_PERIOD_1 = 'At least one locking period required.';
const ERR_INVALID_LOCKING_PERIODS = 'Locking periods must be numbers between 1 and 12.';
const ERR_INVALID_STX_ADDRESS = 'Invalid STX address.';
export function PoolForm({ ownerStxAddress, register, poolId }) {
  let title = 'Update pool';
  let formButtonLabel;
  if (register) {
    title = 'Register a pool';
    formButtonLabel = 'Register';
  } else {
    title = 'Update pool';
    formButtonLabel = 'Update';
  }
  const { doContractCall } = useConnect();
  const name = useRef();
  const priceInfo = useRef();
  const delegateeAddress = useRef();
  const url = useRef();
  const rewardBtcAddresses = useRef();
  const contract = useRef();
  const minimum = useRef();
  const lockingPeriods = useRef();
  const payout = useRef();
  const dateOfPayout = useRef();
  const fees = useRef();
  const poolStatus = useRef();

  const spinner = useRef();
  const [status, setStatus] = useState();
  const [txId, setTxId] = useState();
  const [username, setUsername] = useState();
  const [pool, setPool] = useState();
  const [price, setPrice] = useState();

  const btcAddressFromOwnerStxAddress = ownerStxAddress ? c32.c32ToB58(ownerStxAddress) : '';
  useEffect(() => {
    if (ownerStxAddress) {
      fetchAccount(ownerStxAddress)
        .catch(e => {
          setStatus('Failed to access your account', e);
          console.log(e);
        })
        .then(async acc => {
          console.log({ acc });
        });

      getUsername(ownerStxAddress).then(resultCV => {
        if (resultCV) {
          setUsername(
            `${resultCV.data['name'].buffer.toString()}.${resultCV.data[
              'namespace'
            ].buffer.toString()}`
          );
        } else {
          setUsername(undefined);
        }
      });

      if (poolId) {
        fetchPool(poolId).then(pool => {
          console.log({ pool });
          setPool(pool);
        });
      }
    }
  }, [ownerStxAddress, poolId]);

  const formAction = async () => {
    let functionName;
    let stxPostCondition;
    let priceBN;

    const errors = validateForm();
    if (errors.length > 0) {
      setStatus(
        errors.map(e => (
          <>
            {e}
            <br />
          </>
        ))
      );
      return;
    } else {
      setStatus(undefined);
    }

    const [poolCtrAddress, poolCtrName] = contract.current.value.trim().split('.');
    const traitIndex = await findTraitIndex(poolCtrAddress, poolCtrName);
    if (traitIndex < 0) {
      setStatus('Invalid pool contract');
      return;
    }
    if (register) {
      functionName = registerFunctions[traitIndex];
      if (username) {
        priceBN = new BN(0);
      } else {
        if (!price) {
          await checkPrice();
        }
        priceBN = new BN(price * 1000000);
      }
    } else {
      functionName = updateFunctions[traitIndex];
      priceBN = new BN(0);
    }

    if (username && !(await checkUrl(url.current.value.trim(), username))) {
      setStatus(`Website manifest.json must contain entry "author":"${username}"`);
      return;
    }
    stxPostCondition = makeStandardSTXPostCondition(
      ownerStxAddress,
      FungibleConditionCode.Equal,
      priceBN
    );
    spinner.current.classList.remove('d-none');

    const usernameCV = nameToUsernameCV(name.current.value.trim());
    if (!usernameCV) {
      setStatus(ERR_NAME);
      return;
    }
    const delegateeParts = delegateeAddress.current.value.trim().split('.');

    const delegateeCV =
      delegateeParts.length === 1
        ? standardPrincipalCV(delegateeParts[0])
        : contractPrincipalCV(delegateeParts[0], delegateeParts[1]);
    const poxAddressesCV = listCV(
      rewardBtcAddresses.current.value.split(',').map(addr => poxAddrCVFromBitcoin(addr.trim()))
    );
    const urlCV = stringAsciiCV(url.current.value.trim());
    let minimumUstxCV;
    if (minimum.current.value) {
      minimumUstxCV = someCV(uintCV(parseInt(minimum.current.value) * 1000000));
    } else {
      minimumUstxCV = noneCV();
    }

    if (!lockingPeriods.current.value.trim()) {
      setStatus('Locking Period required.');
      return;
    }
    const lockingPeriodsCV = lockingPeriods.current.value.trim()
      ? listCV(lockingPeriods.current.value.split(',').map(lp => uintCV(parseInt(lp.trim()))))
      : listCV([]);
    const payoutCV = stringAsciiCV(payout.current.value.trim());
    const dateOfPayoutCV = stringAsciiCV(dateOfPayout.current.value.trim());
    const feesCV = stringAsciiCV(fees.current.value.trim());
    const contractCV = contractPrincipalCV(poolCtrAddress, poolCtrName);
    const statusCV = uintCV(poolStatus.current.value);
    console.log({ functionName, lockingPeriodCV: lockingPeriodsCV, poxAddressCV: poxAddressesCV });
    try {
      setStatus(`Sending transaction`);

      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: POOL_REGISTRY_CONTRACT_NAME,
        functionName,
        functionArgs: [
          usernameCV,
          delegateeCV,
          poxAddressesCV,
          urlCV,
          contractCV,
          minimumUstxCV,
          lockingPeriodsCV,
          payoutCV,
          dateOfPayoutCV,
          feesCV,
          statusCV,
        ],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [stxPostCondition],
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

  const checkPrice = async () => {
    const requestedName = name.current.value.trim();
    const parts = requestedName.split('.');
    if (parts.length === 2) {
      const priceResult = await callReadOnlyFunction({
        contractAddress: GENESIS_CONTRACT_ADDRESS,
        contractName: 'bns',
        functionName: 'get-name-price',
        functionArgs: [bufferCVFromString(parts[1]), bufferCVFromString(parts[0])],
        senderAddress: ownerStxAddress,
      });
      console.log({ priceResult });
      if (priceResult.type === ClarityType.ResponseOk) {
        const priceUstx = priceResult.value.value.toNumber() / 1000000;
        setPrice(priceUstx);
        priceInfo.current.innerHTML = `Price: ${priceUstx.toFixed(6)} STX`;
      } else {
        priceInfo.current.innerHTML = 'No price info found.';
      }
    } else {
      priceInfo.current.innerHTML = ERR_NAME;
    }
  };

  const checkUrl = async (url, username) => {
    return verifyUrl(url, username);
  };

  const validateForm = () => {
    const errors = [];
    // username
    if (name.current.value.trim().split('.').length !== 2) {
      name.current.setCustomValidity(ERR_NAME);
      errors.push(ERR_NAME);
    } else {
      name.current.setCustomValidity('');
    }

    // website
    if (!url.current.value.trim()) {
      url.current.setCustomValidity(ERR_URL);
      errors.push(ERR_URL);
    } else {
      url.current.setCustomValidity('');
    }

    // delegatee address
    try {
      console.log(delegateeAddress.current.value.trim());
      c32.c32addressDecode(delegateeAddress.current.value.trim());
      delegateeAddress.current.setCustomValidity('');
    } catch (e) {
      delegateeAddress.current.setCustomValidity(ERR_INVALID_STX_ADDRESS + ' ' + e.toString());
      errors.push(ERR_INVALID_STX_ADDRESS);
    }

    // reward addresses
    const addrList = rewardBtcAddresses.current.value.split(',');
    if (addrList.length === 0) {
      rewardBtcAddresses.setCustomValidity(ERR_REWARD_ADDRESS_1);
      errors.push(ERR_REWARD_ADDRESS_1);
    } else if (
      !addrList.reduce((result, addr) => {
        try {
          c32.b58ToC32(addr.trim());
          return result;
        } catch (e) {
          console.log(addr, e);
          return false;
        }
      }, true)
    ) {
      rewardBtcAddresses.current.setCustomValidity(ERR_INVALID_REWARD_ADDRESSES);
      errors.push(ERR_INVALID_REWARD_ADDRESSES);
    } else {
      rewardBtcAddresses.current.setCustomValidity('');
    }

    // contract
    const [ctrAddr, ctrName] = contract.current.value.trim().split('.');
    if (!ctrAddr || !ctrName) {
      contract.current.setCustomValidity(ERR_INVALID_CONTRACT_ID);
      errors.push(ERR_INVALID_CONTRACT_ID);
    } else {
      contract.current.setCustomValidity('');
    }

    // locking period
    const lockingPeriodList = lockingPeriods.current.value.split(',');
    if (lockingPeriodList.length === 0) {
      lockingPeriods.current.setCustomValidity(ERR_LOCKING_PERIOD_1);
      errors.push(ERR_LOCKING_PERIOD_1);
    } else if (
      !lockingPeriodList.reduce((result, lp) => {
        const period = parseInt(lp.trim());
        return result && !isNaN(period) && period >= 1 && period <= 12;
      }, true)
    ) {
      lockingPeriods.current.setCustomValidity(ERR_INVALID_LOCKING_PERIODS);
      errors.push(ERR_INVALID_LOCKING_PERIODS);
    } else {
      lockingPeriods.current.setCustomValidity('');
    }
    return errors;
  };

  return (
    <div>
      <h5>{title}</h5>
      {(register || (pool && username)) && (
        <div className="NoteField">
          <b>Pool admin's user name</b>
          {register && !username && (
            <>
              <br />A BNS name that is used to protect pool's data. Only the owner of this name can
              update the data. The name must contain exactly 1 dot. e.g. alice.id. Subdomain names
              are not supported by the UI.
              <br />
              The name is registered and paid for during the `register` function call if not yet
              owned by the caller. (Costs around 0.1 STX for friedgerpool.id)
              <br />
              After successful registration of the name, add the name to your website's
              manifest.json file as "author".
            </>
          )}
          <input
            type="text"
            ref={name}
            className="form-control"
            defaultValue={username}
            readOnly={!register || username}
            placeholder="Name, e.g. alice.id"
            onKeyUp={e => {
              if (e.key === 'Enter') delegateeAddress.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          />
          {register && (
            <div className="input-group-append" style={{ alignItems: 'center' }}>
              <button className="btn btn-outline-secondary" type="button" onClick={checkPrice}>
                <div
                  ref={spinner}
                  role="status"
                  className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
                />
                Check price
              </button>
              <div className="pl-4" ref={priceInfo}></div>
            </div>
          )}
          <br />
          <b>Delegatee address</b>
          <br />
          Pool's Stacks address for delegation
          <input
            type="text"
            ref={delegateeAddress}
            className="form-control"
            defaultValue={register ? ownerStxAddress : cvToString(pool.data['delegatee'])}
            placeholder="Stacks address"
            onKeyUp={e => {
              if (e.key === 'Enter') url.current.focus();
            }}
            required
            onBlur={e => {
              validateForm();
            }}
          />
          <br />
          <b>Pool's Website</b>
          <input
            type="text"
            ref={url}
            className="form-control"
            defaultValue={register ? '' : pool.data['url'].data}
            placeholder="Url"
            required
            onKeyUp={e => {
              if (e.key === 'Enter') rewardBtcAddresses.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          />
          <br />
          <b>Reward BTC addresses</b>
          <br />
          One or more BTC addresses, comma separated list
          <input
            type="text"
            ref={rewardBtcAddresses}
            className="form-control"
            defaultValue={
              register
                ? btcAddressFromOwnerStxAddress
                : pool.data['pox-address'].list.map(cv => poxCVToBtcAddress(cv)).join(',')
            }
            placeholder="Pool's reward BTC address"
            onKeyUp={e => {
              if (e.key === 'Enter') contract.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          />
          <br />
          <b>Contract ID</b>
          <br />
          This could be the genesis pox contract or a custom pool contract.
          <input
            type="text"
            ref={contract}
            className="form-control"
            defaultValue={
              register
                ? `${GENESIS_CONTRACT_ADDRESS}.pox`
                : pool.data['contract'].type === ClarityType.OptionalSome
                ? cvToString(pool.data['contract'].value)
                : cvToString(pool.data['contract-ext'].value)
            }
            placeholder="Pool's Contract ID"
            onKeyUp={e => {
              if (e.key === 'Enter') minimum.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          />
          <br />
          <b>Minimum STX</b> required to join
          <input
            type="number"
            ref={minimum}
            step="any"
            min="0"
            className="form-control"
            defaultValue={
              register
                ? undefined
                : pool.data['minimum-ustx'].type === ClarityType.OptionalSome
                ? pool.data['minimum-ustx'].value.value.toNumber() / 1000000
                : undefined
            }
            placeholder="Minimum STX required for joining"
            onKeyUp={e => {
              if (e.key === 'Enter') lockingPeriods.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          />
          <br />
          <b>Locking period</b>
          <br />
          Number of locking cycles (comma separated list of cycles; between 1 and 12). <br />
          <del>Leave empty if variable.</del> At least one entry required due to{' '}
          <a href="https://github.com/blockstack/stacks-wallet-web/issues/1111">#1111</a>.
          <input
            type="text"
            ref={lockingPeriods}
            className="form-control"
            placeholder="e.g. 1, 12"
            defaultValue={
              register
                ? undefined
                : pool.data['locking-period'].list.map(cv => cv.value.toString(10)).join(',')
            }
            onKeyUp={e => {
              if (e.key === 'Enter') payout.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          />
          <br />
          <b>Pool payouts</b> <br />
          Currency of pool payouts
          <select
            type="text"
            ref={payout}
            className="form-control"
            defaultValue={register ? 'BTC' : pool.data['payout'].data}
            placeholder="e.g. BTC, STX, WMNO"
            onKeyUp={e => {
              if (e.key === 'Enter') dateOfPayout.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          >
            <option value="BTC">BTC</option>
            <option value="STX">STX</option>
          </select>
          <br />
          <b>Date of Payout</b>
          <br />
          When the Pool payouts rewards (optional, max 80 char.)
          <input
            type="text"
            ref={dateOfPayout}
            className="form-control"
            defaultValue={register ? '' : pool.data['date-of-payout'].data}
            placeholder="e.g. end of cycle, instant"
            maxLength="80"
            onKeyUp={e => {
              if (e.key === 'Enter') fees.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          />
          <br />
          <b>Fees</b>
          <br />
          What are the fees (optional, max 80 char.)
          <input
            type="text"
            ref={fees}
            className="form-control"
            defaultValue={register ? '' : pool.data['fees'].data}
            placeholder="e.g. 10%, 5 STX"
            maxLength="80"
            onKeyUp={e => {
              if (e.key === 'Enter') poolStatus.current.focus();
            }}
            onBlur={e => {
              validateForm();
            }}
          />
          <br />
          <b>Status</b>
          <br />
          One of "In development", "In production", "Open to join", "Closed for next cycle",
          "Retired"
          <select
            ref={poolStatus}
            className="form-control"
            defaultValue={register ? '0' : pool.data['status'].value.toNumber()}
            onKeyUp={e => {
              if (e.key === 'Enter') formAction();
            }}
            onBlur={e => {
              validateForm();
            }}
          >
            <option value="0">In development (0)</option>
            <option value="1">In production (1)</option>
            <option value="11">Open to join for next cycle (11)</option>
            <option value="21">Closed for next cycle (21)</option>
            <option value="99">Retired (99)</option>
          </select>
          <br />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={formAction}>
              <div
                ref={spinner}
                role="status"
                className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
              />
              {formButtonLabel}
            </button>
          </div>
        </div>
      )}
      {!register && !pool && <>Loading pool data...</>}
      <div>
        <TxStatus txId={txId} resultPrefix="Order placed in block " />
      </div>
      {status && (
        <>
          <div>{status}</div>
        </>
      )}
    </div>
  );
}
