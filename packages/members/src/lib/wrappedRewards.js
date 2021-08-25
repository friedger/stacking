import {
  callReadOnlyFunction,
  ClarityType,
  cvToHex,
  cvToString,
  standardPrincipalCV,
} from '@stacks/transactions';
import { accountsApi, FPWR_03_CONTRACT, smartContractsApi } from './constants';

export async function wasSubmitted(txCV) {
  console.log(cvToString(txCV));
  const entryResponse = await smartContractsApi.getContractDataMapEntry({
    contractAddress: FPWR_03_CONTRACT.address,
    contractName: FPWR_03_CONTRACT.name,
    mapName: 'rewards-by-tx',
    key: cvToHex(txCV),
  });
  console.log(entryResponse);
  return entryResponse.data !== '0x09';
}

export async function fetchSubmittedTxList() {
  const response = await accountsApi.getAccountTransactions({
    principal: `${FPWR_03_CONTRACT.address}.${FPWR_03_CONTRACT.name}`,
  });

  console.log(response);
  const result = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      tx.contract_call.function_name === 'mint'
  );

  console.log(result);
  return result;
}

export async function fetchDepot(depotContract) {
  const response = await callReadOnlyFunction({
    contractAddress: depotContract.address,
    contractName: depotContract.name,
    functionName: 'get-depot-info',
    functionArgs: [],
    senderAddress: depotContract.address,
  });
  console.log({ response });
  if (response.type === ClarityType.OptionalNone) {
    return undefined;
  } else {
    return response;
  }
}

export async function fetchDepotBalance(stacker, depotContract) {
  const response = await callReadOnlyFunction({
    contractAddress: depotContract.address,
    contractName: depotContract.name,
    functionName: 'get-balance',
    functionArgs: [standardPrincipalCV(stacker)],
    senderAddress: depotContract.address,
  });
  console.log({ response });
  if (response.type === ClarityType.ResponseErr || response.value.type === ClarityType.OptionalNone) {
    return undefined;
  } else {
    return response.value.value; // unwrapped ok and unwrap optional of type uintCV
  }
}

export async function fetchTokenBalance(stacker, tokenContract) {
  const response = await callReadOnlyFunction({
    contractAddress: tokenContract.address,
    contractName: tokenContract.name,
    functionName: 'get-balance',
    functionArgs: [standardPrincipalCV(stacker)],
    senderAddress: tokenContract.address,
  });
  console.log({ response });
  if (response.type === ClarityType.ResponseErr || response.value.type === ClarityType.OptionalNone) {
    return undefined;
  } else {
    return response.value.value; // unwrapped ok and unwrap optional of type uintCV
  }
}
