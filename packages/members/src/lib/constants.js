import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
  BlocksApi,
  NamesApi,
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
export const FRIEDGER_POOL_HINTS = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'friedgerpool-payout-hints',
};
export const FRIEDGER_POOL_XBTC = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'friedgerpool-payout-xbtc',
};
export const CLARITY_BITCOIN_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'clarity-bitcoin-lib-v1',
};

export const FPWR_03_CONTRACT = {
  address: 'SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4',
  name: 'fpwr-v03',
};

export const FPWR_03_DEPOT_CONTRACT = {
  address: 'SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4',
  name: 'fpwr-v03-depot',
};

export const FPWR_04_CONTRACT = {
  address: 'SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4',
  name: 'fpwr-v04',
};

export const FPWR_04_DEPOT_CONTRACT = {
  address: 'SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4',
  name: 'fpwr-v04-depot',
};

export const authOrigin = 'https://app.blockstack.org';
export const chainSuffix = '?chain=mainnet';
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
export const blocksApi = new BlocksApi(config);
export const namesApi = new NamesApi(config);
