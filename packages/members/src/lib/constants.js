import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
} from '@stacks/blockchain-api-client';
import { StacksMainnet } from '@stacks/network';

export const CONTRACT_ADDRESS = 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60';
export const POOL_REGISTRY_CONTRACT_NAME = 'pool-registry-v1';
export const GENESIS_CONTRACT_ADDRESS = 'SP000000000000000000002Q6VF78';
export const BNS_CONTRACT_NAME = 'bns';
export const FRIEDGER_POOL_NFT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'friedger-pool-nft',
};

export const authOrigin = 'https://app.blockstack.org';

export const STACK_API_URL = 'https://stacks-node-api.mainnet.stacks.co';
export const STACKS_API_WS_URL = 'ws://stacks-node-api.mainnet.stacks.co/';
export const STACKS_API_ACCOUNTS_URL = `${STACK_API_URL}/v2/accounts`;

export const NETWORK = new StacksMainnet();
NETWORK.coreApiUrl = STACK_API_URL;

const basePath = STACK_API_URL;
const config = new Configuration({ basePath });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);
