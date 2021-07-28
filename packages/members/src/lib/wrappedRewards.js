import { FPWR_CONTRACT, smartContractsApi } from './constants';

export async function wasSubmitted(txCV) {
  console.log(txCV);
  const entryResponse = await smartContractsApi.getContractDataMapEntry({
    contractAddress: FPWR_CONTRACT.address,
    contractName: FPWR_CONTRACT.name,
    mapName: 'rewards-by-tx',
    key: txCV,
  });
  console.log(entryResponse);
  return !!entryResponse.data;
}
