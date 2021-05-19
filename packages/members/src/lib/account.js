import {
  createStacksPrivateKey,
  getPublicKey,
  addressFromPublicKeys,
  AddressVersion,
  AddressHashMode,
  callReadOnlyFunction,
  bufferCVFromString,
  ClarityType,
  cvToString,
  cvToHex,
  standardPrincipalCV,
  hexToCV,
} from '@stacks/transactions';
import { Storage } from '@stacks/storage';
import { STX_JSON_PATH } from '../UserSession';
import {
  accountsApi,
  BNS_CONTRACT_NAME,
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  smartContractsApi,
  STACKS_API_ACCOUNTS_URL,
} from './constants';

export function getStacksAccount(appPrivateKey) {
  const privateKey = createStacksPrivateKey(appPrivateKey);
  const publicKey = getPublicKey(privateKey);
  const address = addressFromPublicKeys(
    AddressVersion.MainnetSingleSig,
    AddressHashMode.SerializeP2PKH,
    1,
    [publicKey]
  );
  return { privateKey, address };
}

export async function getUserAddress(userSession, username) {
  const parts = username.split('.');
  if (parts.length === 2) {
    console.log(parts);
    const result = await callReadOnlyFunction({
      contractAddress: GENESIS_CONTRACT_ADDRESS,
      contractName: BNS_CONTRACT_NAME,
      functionName: 'name-resolve',
      functionArgs: [bufferCVFromString(parts[1]), bufferCVFromString(parts[0])],
      network: NETWORK,
      senderAddress: GENESIS_CONTRACT_ADDRESS,
    });
    if (result.type === ClarityType.ResponseOk) {
      return { address: cvToString(result.value.data.owner) };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

/**
 * Uses the AccountsApi of the stacks blockchain api client library,
 * returns the stacks balance object with property `balance` in decimal.
 */
export function fetchAccount(addressAsString) {
  console.log(`Checking account "${addressAsString}"`);
  if (addressAsString) {
    return accountsApi
      .getAccountBalance({ principal: addressAsString })
      .then(response => response.stx);
  } else {
    return Promise.reject();
  }
}

/**
 * Uses the RCP api of the stacks node directly,
 * returns the json object with property `balance` in hex.
 */
export function fetchAccount2(addressAsString) {
  console.log('Checking account');
  const balanceUrl = `${STACKS_API_ACCOUNTS_URL}/${addressAsString}`;
  return fetch(balanceUrl).then(r => {
    console.log({ r });
    return r.json();
  });
}

export async function getUsername(addressAsString) {
  const nameResult = await smartContractsApi.callReadOnlyFunction({
    contractAddress: GENESIS_CONTRACT_ADDRESS,
    contractName: 'bns',
    functionName: 'resolve-principal',
    readOnlyFunctionArgs: {
      sender: addressAsString,
      arguments: [cvToHex(standardPrincipalCV(addressAsString))],
    },
  });
  if (nameResult.okay && nameResult.result !== '0x09') {
    const resultCV = hexToCV(nameResult.result);
    if (resultCV.type === ClarityType.ResponseOk) {
      return resultCV.value;
    } else {
      console.log({ nameResult });
      console.log('No name found. Error: ' + resultCV.value.data.code.value.toString(10));
      return undefined;
    }
  } else {
    return undefined;
  }
}
