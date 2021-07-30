import { cvToHex, cvToString } from '@stacks/transactions';
import { accountsApi, FPWR_CONTRACT, smartContractsApi } from './constants';

export async function wasSubmitted(txCV) {
  console.log(cvToString(txCV));
  const entryResponse = await smartContractsApi.getContractDataMapEntry({
    contractAddress: FPWR_CONTRACT.address,
    contractName: FPWR_CONTRACT.name,
    mapName: 'rewards-by-tx',
    key: cvToHex(txCV),
  });
  console.log(entryResponse);
  return entryResponse.data !== "0x09"
}



export async function fetchSubmittedTxList() {
  const response = await accountsApi.getAccountTransactions({
    principal: `${FPWR_CONTRACT.address}.${FPWR_CONTRACT.name}`,
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
