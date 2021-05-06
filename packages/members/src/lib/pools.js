import {
  bufferCVFromString,
  callReadOnlyFunction,
  ClarityType,
  cvToString,
  falseCV,
  listCV,
  trueCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import {
  CONTRACT_ADDRESS,
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  POOL_REGISTRY_CONTRACT_NAME,
  STACK_API_URL,
} from './constants';

const contractAddress = CONTRACT_ADDRESS;
const contractName = POOL_REGISTRY_CONTRACT_NAME;

export async function fetchPool(poolId) {
  const receipt = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-pool',
    functionArgs: [uintCV(poolId)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  console.log(receipt);
  if (receipt.type === ClarityType.OptionalNone) {
    return undefined;
  } else {
    return receipt.value;
  }
}

export async function fetchPools({ verify = false, offset = 0 }) {
  console.log({ verify, offset });
  const idsCV = [...Array(10).keys()].map(i => uintCV(i + 1 + offset));
  const receipt = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-pools',
    functionArgs: [listCV(idsCV)],
    network: NETWORK,
    senderAddress: contractAddress,
  });

  const verifiedPools = await Promise.all(
    receipt.list.map(async (cv, index) => {
      if (cv.type === ClarityType.OptionalNone) {
        return cv;
      } else {
        const poolCV = cv.value;
        poolCV.data['pool-id'] = idsCV[index];
        if (verify) {
          const verified = await verifyUrl(
            poolCV.data.url.data,
            usernameCVToName(poolCV.data.name)
          );
          poolCV.data['verified'] = verified ? trueCV() : falseCV();
          return poolCV;
        } else {
          return poolCV;
        }
      }
    })
  );

  return verifiedPools.reduce((result, cv) => {
    if (cv.type === ClarityType.OptionalNone) {
      return result;
    } else {
      result.push(cv);
      return result;
    }
  }, []);
}

export function nameToUsernameCV(fullQualifiedName) {
  const parts = fullQualifiedName.split('.');
  if ((parts.length = 2)) {
    const [name, namespace] = parts;
    console.log(parts);
    return tupleCV({ name: bufferCVFromString(name), namespace: bufferCVFromString(namespace) });
  } else {
    return undefined;
  }
}

export function usernameCVToName(usernameCV) {
  return `${usernameCV.data.name.buffer.toString()}.${usernameCV.data.namespace.buffer.toString()}`;
}

const whiteListedUrls = {
  'https://pool.friedger.de': 'friedgerpool.id',
};

export async function verifyUrl(url, username) {
  const whiteListedUsername = whiteListedUrls[url];
  if (whiteListedUsername) {
    return whiteListedUsername === username;
  } else {
    try {
      const result = await fetch(url + '/manifest.json');
      const manifest = await result.json();
      console.log({ manifest, username }, manifest.author === username);
      if (manifest.author) {
        whiteListedUrls[url] = manifest.author;
      }
      return manifest.author === username;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

const whiteListedContracts = {};
whiteListedContracts[
  `${GENESIS_CONTRACT_ADDRESS}/pox/${CONTRACT_ADDRESS}/${POOL_REGISTRY_CONTRACT_NAME}/pool-trait`
] = true;

export async function findTraitIndex(ctrAddress, ctrName) {
  if (await verifyContractTrait(ctrAddress, ctrName, 'pool-trait')) {
    return 0;
  } else if (await verifyContractTrait(ctrAddress, ctrName, 'pool-trait-ext')) {
    return 1;
  } else if (await verifyContractTrait(ctrAddress, ctrName, 'pool-trait-ext2')) {
    return 2;
  } else {
    return -1;
  }
}

export const registerFunctions = ['register', 'register-ext', 'register-ext2'];
export const updateFunctions = ['update', 'update-ext', 'update-ext2'];

export function getPoolContractId(pool) {
  const contractCV =
    pool.data.contract.type === ClarityType.OptionalSome
      ? pool.data.contract.value
      : pool.data.contract.ext.type === ClarityType.OptionalSome
      ? pool.data['extended-contract']
      : pool.data['extended2-contract'];
  return cvToString(contractCV);
}

async function verifyContractTrait(ctrAddress, ctrName, traitName) {
  const path = `${ctrAddress}/${ctrName}/${CONTRACT_ADDRESS}/${POOL_REGISTRY_CONTRACT_NAME}/${traitName}`;

  console.log({ path });
  if (path in whiteListedContracts) {
    return whiteListedContracts[path];
  } else {
    let isImplemented;
    const result = await fetch(`${STACK_API_URL}/v2/traits/${path}`);
    console.log({ result });
    if (result.status === 404) {
      isImplemented = false;
    } else {
      isImplemented = (await result.json()).is_implemented;
    }
    whiteListedContracts.path = isImplemented;
    return isImplemented;
  }
}
