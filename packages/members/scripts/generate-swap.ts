import fs, { read, readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { txsProxy109 } from './txs-proxy-109.ts';
import { accountsApi, transactionsApi } from './../src/lib/constants.ts';
import { AmountBTC } from '../src/components/Amount';
import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client';
const FAST_POOL_V1 = 'bc1qs0kkdpsrzh3ngqgth7mkavlwlzr7lms2zv3wxe';
const FAST_POOL_V1_CHANGE = 'bc1qs3rq94gjs849uslyaenhfkka0cwjkk6djflyqc';
const FAST_POOL_V2 = 'bc1q7w0jpwwjyq48qhyecnuwazfqv56880q67pmtfc';
const PROXY_ADDRESS = 'bc1quj0ysumcxjs9qklfhjnukcrhwmkwttd0etm5nl';
const RESERVE_ADDRESS = 'bc1qjfphatmmrrflycaycce8jn5ds49jutzern4pal';
const MEMBER_ADDRESS = 'bc1qk4jnd4jqd9he65la0nz6xnz6g3772l89eaem0t';
const MEMPOOL_API = 'https://mempool.space/api/address';

type Tx = {
  txid: string;
  vin: {
    txid: string;
    vout: number;
    sequence: number;
    prevout: {
      value: number;
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
    };
    scriptsig: string;
    scriptsig_asm: string;
    witness: string[];
    is_coinbase: boolean;
  }[];
  vout: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
  }[];
  fee: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_time: number;
    block_hash: string;
  };
};

async function getLatestTxs(address: string) {
  const res = await fetch(`${MEMPOOL_API}/${address}/txs`);
  const txs = await res.json();
  return txs as Tx[];
}

function btcFromSats(sats: number) {
  return (sats / 1e8).toFixed(8);
}

function stxFromUstx(ustx: number, locale: boolean = false) {
  return locale
    ? (ustx / 1e6).toLocaleString('en-US', { maximumFractionDigits: 6 })
    : (ustx / 1e6).toFixed(6);
}

function isSwapTx(tx: Tx) {
  return (
    tx.vin[0].prevout.scriptpubkey_address === PROXY_ADDRESS &&
    tx.vout[0].scriptpubkey_type === 'v0_p2wpkh' &&
    ((tx.vout.length === 2 && tx.vout[1].scriptpubkey_address === PROXY_ADDRESS) ||
      tx.vout.length === 1)
  );
}

function isBtcWrap(tx: Tx) {
  return (
    tx.vin[0].prevout.scriptpubkey_address === PROXY_ADDRESS &&
    tx.vout[0].scriptpubkey_type === 'v1_p2tr' &&
    ((tx.vout.length === 2 && tx.vout[1].scriptpubkey_address === PROXY_ADDRESS) ||
      tx.vout.length === 1)
  );
}

function isMemberTx(tx: Tx) {
  return (
    tx.vin[0].prevout.scriptpubkey_address === PROXY_ADDRESS &&
    tx.vout.length === 3 &&
    tx.vout.find(vout => vout.scriptpubkey_address === RESERVE_ADDRESS) &&
    tx.vout.find(vout => vout.scriptpubkey_address === PROXY_ADDRESS) &&
    tx.vout.find(vout => vout.scriptpubkey_address === MEMBER_ADDRESS)
  );
}

async function main(
  cycleId: number,
  {
    proxyTxs,
    stxSwapTxs,
  }: {
    proxyTxs: Tx[];
    stxSwapTxs: {
      txsWithTransfers: AddressTransactionWithTransfers[];
      txsWithSbtcWrapFinalize: AddressTransactionWithTransfers[];
      txsWithSbtcToDistribute: AddressTransactionWithTransfers[];
      txsWithSbtcStxSwap: AddressTransactionWithTransfers[];
      txsWithStxSbtcSwap: AddressTransactionWithTransfers[];
    };
  }
) {
  const outputFile = __dirname + `/../../../packages/home/content/rewards/${cycleId}-swap.md`;
  // Read payout data
  const payouts = JSON.parse(
    fs.readFileSync(
      __dirname + `/../../../packages/home/data/rewards/payout-${cycleId}.json`,
      'utf-8'
    )
  );

  // find v1Tx in proxyTxs
  const firstConsolidationPossible = 666050 + cycleId * 2100 + 500;
  const possibleTxs = proxyTxs.filter(tx => tx.status.block_height > firstConsolidationPossible);
  possibleTxs.reverse();
  console.log(`Found ${possibleTxs.map(tx => tx.txid)} as possible transactions`);

  const v1Txs = possibleTxs.filter(
    tx =>
      tx.vin[0].prevout.scriptpubkey_address === FAST_POOL_V1 ||
      tx.vin[0].prevout.scriptpubkey_address === FAST_POOL_V1_CHANGE
  );
  const v2Txs = possibleTxs.filter(tx => tx.vin[0].prevout.scriptpubkey_address === FAST_POOL_V2);

  console.log(`Found ${v1Txs.map(tx => tx.txid)} as v1 possible transactions`);
  console.log(`Found ${v2Txs.map(tx => tx.txid)} as v2 possible transactions`);

  const remainingTxs = possibleTxs.filter(
    // tx not in v1Txs or v2Txs
    tx => !v1Txs.find(v1Tx => v1Tx.txid === tx.txid) && !v2Txs.find(v2Tx => v2Tx.txid === tx.txid)
  );

  const swapTxs = remainingTxs.filter(tx => isSwapTx(tx));

  // add corresponding stx swap tx to btc swap tx from remainingTxs
  // iterate over remainingTxs and find corresponding stx swap tx
  const remainingTxsWithStxSwap: { tx: Tx; stxTx: any }[] = [];
  let swapIndex = 0;
  for (let i: number = 0; i < remainingTxs.length; i++) {
    const tx = remainingTxs[i];
    if (isSwapTx(tx)) {
      const stxTx = stxSwapTxs.txsWithTransfers[swapIndex];
      remainingTxsWithStxSwap.push({ tx, stxTx });
      swapIndex++;
    } else if (isBtcWrap(tx)) {
      const stxTx = stxSwapTxs.txsWithSbtcWrapFinalize.find(sbtcTx => {
        return (sbtcTx.tx as any).contract_call.function_args[0].repr === `0x${tx.txid}`;
      });
      remainingTxsWithStxSwap.push({ tx, stxTx: stxTx || null });
    } else {
      remainingTxsWithStxSwap.push({ tx, stxTx: null });
    }
  }

  // Extract values from JSON
  const totalBtc = payouts.meta.rewardsInBtc;
  const totalBtcAfterFees = btcFromSats(
    v1Txs.reduce((acc, tx) => acc + tx.vout[0].value, 0) +
      v2Txs.reduce((acc, tx) => acc + tx.vout[0].value, 0)
  );
  const stxPartRewards = (parseInt(payouts.meta.stxPartRewardsInUstx, 10) / 1e6).toLocaleString(
    undefined,
    { maximumFractionDigits: 6 }
  );
  const distributedBtc = btcFromSats(payouts.transferBtc.outputs[0].rewards);
  const reserveSats = payouts.transferBtc.outputs[payouts.transferBtc.outputs.length - 1].rewards;
  const reserveBtc = btcFromSats(reserveSats);

  const stackedStxSTXReceivers = stxFromUstx(
    payouts.stats.statsStandard?.totalStackedSTXReceivers ||
      payouts.stats.statsStandardStx.totalStackedSTXReceivers
  );
  const theoreticalStxRewards = stxFromUstx(payouts.info.theoreticalStxRewards);

  // calculated swapped stx
  const swappedStx =
    // all simple swaps
    stxSwapTxs.txsWithTransfers.reduce((acc, tx) => {
      const amount = Number(tx.stx_received);
      return acc + amount;
    }, 0) +
    // all sbtc to stx swaps
    stxSwapTxs.txsWithSbtcStxSwap.reduce((acc, tx) => {
      const amount = Number(tx.stx_received);
      return acc + amount;
    }, 0) -
    // minus stx to sbtc swaps
    stxSwapTxs.txsWithStxSbtcSwap.reduce((acc, tx) => {
      const amount = Number(tx.stx_sent);
      return acc + amount;
    }, 0);
  console.log(`Swapped ${swappedStx} ustx`);

  // sum up all sats in swapTxs
  const swappedSats =
    swapTxs.reduce((acc, tx) => {
      const vout = tx.vout.find(vout => vout.scriptpubkey_address !== PROXY_ADDRESS);
      return acc + (vout ? vout.value : 0);
    }, 0) +
    stxSwapTxs.txsWithSbtcStxSwap.reduce((acc, tx: any) => {
      const amount =
        Number(tx.ft_transfers[0].amount) +
        Number(tx.ft_transfers[1].amount) +
        Number(tx.ft_transfers[2].amount);
      return acc + amount;
    }, 0) -
    // minus stx to sbtc swaps
    stxSwapTxs.txsWithStxSbtcSwap.reduce((acc, tx: any) => {
      const amount = Number(tx.ft_transfers[0].amount);
      return acc + amount;
    }, 0);
  console.log(`Swapped ${swappedSats} sats`);

  const feesInStx = (reserveSats * swappedStx) / swappedSats;
  const feesPercentage = (feesInStx / payouts.info.theoreticalStxRewards) * 100;
  const feesPercentageFormatted = feesPercentage.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
  const remainingBtc =
    parseFloat(totalBtcAfterFees) - parseFloat(distributedBtc) - parseFloat(reserveBtc);
  // Compose markdown
  const md = `---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of ${totalBtcAfterFees} BTC to the proxy address.

We distributed ${distributedBtc} BTC to pool members who registered for BTC rewards and ${reserveBtc} BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of ${remainingBtc.toFixed(8)} BTC were swapped to ${stxPartRewards} STX in ${swapTxs.length} transactions using simpleswap.

We swapped ${btcFromSats(swappedSats)} BTC to ${stxFromUstx(swappedStx, true)} STX using the sBTC-STX liquidity pools on the Stacks blockchain.

The amount of ${(remainingBtc - swappedSats / 1e8).toFixed(8)} sBTC was sent to the users as sBTC rewards.

Transactions for Fast Pool v1:

<ul>
${v1Txs
  .map(
    tx => `
{{% toproxy btc="${btcFromSats(tx.vout[0].value)}"
  btctx="https://mempool.space/tx/${tx.txid}" %}}
  `
  )
  .join('\n')}
</ul>

Transactions for Fast Pool v2:

<ul>
${v2Txs
  .map(
    tx => `
{{% toproxy btc="${btcFromSats(tx.vout[0].value)}"
  btctx="https://mempool.space/tx/${tx.txid}" %}}
  `
  )
  .join('\n')}
</ul>
Transactions to and from proxy address:

<ul>
${remainingTxsWithStxSwap
  .map((txTuple, index) => {
    const tx = txTuple.tx;
    if (isSwapTx(tx) && txTuple.stxTx) {
      return `{{% swap btc="${btcFromSats(tx.vout[0].value)}" stx="${stxFromUstx(txTuple.stxTx.stx_received, true)}"
  btctx="https://mempool.space/tx/${tx.txid}"
  stxtx="${txTuple.stxTx.tx.tx_id}" %}}
`;
    } else if (isMemberTx(tx)) {
      return `{{% payoutbtc members="${btcFromSats(
        tx.vout.find(out => out.scriptpubkey_address === MEMBER_ADDRESS)?.value || 0
      )}" reserve="${btcFromSats(
        tx.vout.find(vo => vo.scriptpubkey_address === RESERVE_ADDRESS)?.value || 0
      )}"
  btctx="https://mempool.space/tx/${tx.txid}" %}}
  `;
    } else if (isBtcWrap(tx) && txTuple.stxTx) {
      return `{{% wrap btc="${btcFromSats(tx.vout[0].value)}"
  btctx="https://mempool.space/tx/${tx.txid}" stxtx="${txTuple.stxTx.tx.tx_id}" %}}
  `;
    } else {
      return `<li>${tx.txid} (${btcFromSats(tx.vout[0].value)} BTC)</li>`;
    }
  })
  .join('\n')}
</ul>

### Compensation as Stacks Signer after Nakamoto Release (${feesPercentageFormatted}% reserve)

{{% reserve cycle="${cycleId}" satstoreserve="${reserveSats}"
stackedstxforstx="${stackedStxSTXReceivers}" swappedsats="${swappedSats}"
swappedstx="${swappedStx / 1e6}" totalstx="${theoreticalStxRewards}" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle ${cycleId}](/img/cycles/${cycleId}-simpleswap.png)

### Swapping using sBTC-STX Pools
We swapped ${btcFromSats(swappedSats)} BTC to ${stxFromUstx(swappedStx, true)} STX using the sBTC-STX liquidity pools on the Stacks blockchain.

<ul>
${stxSwapTxs.txsWithSbtcStxSwap
  .map(
    tx => `
{{% swapSbtcToStx sbtc="${btcFromSats(Number(tx.ft_transfers![0].amount) + Number(tx.ft_transfers![1].amount) + Number(tx.ft_transfers![2].amount))}" stx="${stxFromUstx(Number(tx.stx_received), true)}"
  stxtx="${(tx.tx as any).tx_id}" %}}
  `
  )
  .join('\n')}
</ul>

<ul>
${stxSwapTxs.txsWithStxSbtcSwap
  .map(
    tx => `
{{% swapStxToSbtc sbtc="${btcFromSats(Number(tx.ft_transfers![0].amount))}" stx="${stxFromUstx(Number(tx.stx_sent), true)}"
  stxtx="${(tx.tx as any).tx_id}" %}}
  `
  )
  .join('\n')}
</ul>
`;

  fs.writeFileSync(outputFile, md);
  console.log(`Generated ${outputFile}`);
}

async function getBtcData(cycleId: number) {
  const filename = __dirname + `/../../../packages/members/scripts/txs-proxy-${cycleId}.json`;
  // Check if file exists
  if (fs.existsSync(filename)) {
    console.log(`Using cached btc transactions from ${filename}`);
    const data = readFileSync(filename, 'utf-8');
    return JSON.parse(data) as Tx[];
  }
  console.log(`Fetching latest btc transactions for cycle ${cycleId}...`);
  // Get latest transactions
  const [proxyTxs] = await Promise.all([
    //getLatestTx(FAST_POOL_V1),
    //getLatestTx(FAST_POOL_V2),
    getLatestTxs(PROXY_ADDRESS),
  ]);
  writeFileSync(filename, JSON.stringify(proxyTxs));
  return proxyTxs;
  //return txsProxy109;
}

async function getStxSwapTransactions(cycleId: number) {
  // Get latest transactions
  const res = await accountsApi.getAccountTransactionsWithTransfers({
    principal: 'SP3KJBWTS3K562BF5NXWG5JC8W90HEG7WPYH5B97X',
  });
  const firstConsolidationPossible = 666050 + cycleId * 2100 + 500;

  const txs = res.results.filter(
    tx =>
      (tx.tx as any).burn_block_height > firstConsolidationPossible &&
      (tx.tx as any).tx_status === 'success'
  );

  const txsWithTransfers = txs.filter(
    tx =>
      BigInt(tx.stx_received) > 0n &&
      // try to filter only transfers from simple swap
      (tx.tx as any).tx_type === 'token_transfer' &&
      ((tx.tx as any).token_transfer.memo as string).startsWith('0x313131')
  );
  txsWithTransfers.reverse();

  const txsWithSbtcWrapFinalize = txs.filter(
    tx =>
      BigInt(tx.ft_transfers?.[0]?.amount || 0) > 0n &&
      tx.ft_transfers?.[0]?.asset_identifier ===
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token' &&
      tx.ft_transfers?.[0]?.recipient === 'SP3KJBWTS3K562BF5NXWG5JC8W90HEG7WPYH5B97X' &&
      (tx.tx as any).tx_type === 'contract_call' &&
      (tx.tx as any).contract_call.contract_id ===
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-deposit' &&
      (tx.tx as any).contract_call.function_name === 'complete-deposit-wrapper'
  );
  txsWithSbtcWrapFinalize.reverse();

  const txsWithSbtcToDistribute = txs.filter(
    tx =>
      tx.ft_transfers?.length === 1 &&
      BigInt(tx.ft_transfers?.[0]?.amount || 0) > 0n &&
      tx.ft_transfers?.[0]?.asset_identifier ===
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token' &&
      tx.ft_transfers?.[0]?.sender === 'SP3KJBWTS3K562BF5NXWG5JC8W90HEG7WPYH5B97X' &&
      tx.ft_transfers?.[0]?.recipient === 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP'
  );
  txsWithSbtcToDistribute.reverse();

  const txsWithSbtcStxSwap = txs.filter(
    tx =>
      tx.ft_transfers?.length === 3 &&
      BigInt(tx.ft_transfers?.[1]?.amount || 0) > 0n &&
      tx.ft_transfers?.[1]?.asset_identifier ===
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token' &&
      tx.ft_transfers?.[1]?.sender === 'SP3KJBWTS3K562BF5NXWG5JC8W90HEG7WPYH5B97X' &&
      tx.ft_transfers?.[1]?.recipient ===
        'SM1793C4R5PZ4NS4VQ4WMP7SKKYVH8JZEWSZ9HCCR.xyk-pool-sbtc-stx-v-1-1'
  );
  txsWithSbtcStxSwap.reverse();

  txs.filter((tx: any) => {
    console.log(tx.tx.tx_id, tx.ft_transfers);
    return tx.ft_transfers?.length === 3 && BigInt(tx.ft_transfers?.[1]?.amount || 0) > 0n;
  });

  const txsWithStxSbtcSwap = txs.filter(
    tx =>
      tx.ft_transfers?.length === 1 &&
      BigInt(tx.ft_transfers?.[0]?.amount || 0) > 0n &&
      tx.ft_transfers?.[0]?.asset_identifier ===
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token' &&
      tx.ft_transfers?.[0]?.sender ===
        'SP20X3DC5R091J8B6YPQT638J8NR1W83KN6TN5BJY.univ2-pool-v1_0_0-0070' &&
      tx.ft_transfers?.[0]?.recipient === 'SP3KJBWTS3K562BF5NXWG5JC8W90HEG7WPYH5B97X'
  );
  txsWithStxSbtcSwap.reverse();
  return {
    txsWithTransfers,
    txsWithSbtcWrapFinalize,
    txsWithSbtcToDistribute,
    txsWithSbtcStxSwap,
    txsWithStxSbtcSwap,
  };
}

const generateMd = async (cycleId: number) => {
  const [proxyTxs, stxSwapTxs] = await Promise.all([
    getBtcData(cycleId),
    getStxSwapTransactions(cycleId),
  ]);
  main(cycleId, {
    //   swapTxs: [
    //     '798db8e94caaa3aeb25584a964d9c323e7a8fcfcb0b75d189bd03756fac2d7a8',
    //     'bf4a54846da42315f676d043b915d5058bcf16c78c8cdb4d9c05cc1aff9b6811',
    //   ],
    //   memberTxs: ['73910879c06e9bb43bb8a00b1b191af7b6f16ac35b2815e8a0cf41bc7c420847'],
    proxyTxs,
    stxSwapTxs,
  });
};

generateMd(119).catch(console.error);
