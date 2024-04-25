import { ClarityType, cvToHex, hexToCV, standardPrincipalCV, tupleCV } from '@stacks/transactions';
import { NETWORK, smartContractsApi } from './constants';

export async function fetchDelegationState(ownerStxAddress) {
  const result = await smartContractsApi.getContractDataMapEntry({
    contractAddress: 'SP000000000000000000002Q6VF78',
    contractName: 'pox-4',
    mapName: 'delegation-state',
    key: cvToHex(tupleCV({ stacker: standardPrincipalCV(ownerStxAddress) })),
    network: NETWORK,
  });

  console.log(result);
  const mapEntry = hexToCV(result.data);

  if (mapEntry.type === ClarityType.OptionalNone) {
    return { state: undefined };
  } else {
    return { state: mapEntry.value };
  }
}
