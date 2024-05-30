import {
  ClarityType,
  OptionalCV,
  cvToHex,
  hexToCV,
  standardPrincipalCV,
  tupleCV,
} from '@stacks/transactions';
import { smartContractsApi } from './constants';

export async function fetchDelegationState(ownerStxAddress: string) {
  const result = await smartContractsApi.getContractDataMapEntry({
    contractAddress: 'SP000000000000000000002Q6VF78',
    contractName: 'pox-4',
    mapName: 'delegation-state',
    key: cvToHex(tupleCV({ stacker: standardPrincipalCV(ownerStxAddress) })),
  });

  console.log(result);
  const mapEntry = hexToCV(result.data) as OptionalCV;

  if (mapEntry.type === ClarityType.OptionalNone) {
    return { state: undefined };
  } else {
    return { state: mapEntry.value };
  }
}
