import fs from 'fs';
import fetch from 'node-fetch';
import { txsProxy109 } from './txs-proxy-109.ts';
import { accountsApi, transactionsApi } from './../src/lib/constants.ts';
const FAST_POOL_V1 = 'bc1qs0kkdpsrzh3ngqgth7mkavlwlzr7lms2zv3wxe';
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
  { proxyTxs, stxSwapTxs }: { proxyTxs: Tx[]; stxSwapTxs: any[] }
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

  const v1Txs = possibleTxs.filter(tx => tx.vin[0].prevout.scriptpubkey_address === FAST_POOL_V1);
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
      const stxTx = stxSwapTxs[swapIndex];
      remainingTxsWithStxSwap.push({ tx, stxTx });
      swapIndex++;
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
  const reserveBtc = btcFromSats(payouts.transferBtc.outputs[1].rewards);
  const stackedStxSTXReceivers = stxFromUstx(payouts.stats.statsStandard.totalStackedSTXReceivers);
  const theoreticalStxRewards = stxFromUstx(payouts.info.theoreticalStxRewards);

  const swappedStx = stxSwapTxs.reduce((acc, tx) => {
    const amount = Number(tx.stx_received);
    return acc + amount;
  }, 0);

  const swappedSats = swapTxs.reduce((acc, tx) => {
    const vout = tx.vout.find(vout => vout.scriptpubkey_address !== PROXY_ADDRESS);
    return acc + (vout ? vout.value : 0);
  }, 0);

  const feesInStx = (payouts.transferBtc.outputs[1].rewards * swappedStx) / swappedSats;
  const feesPercentage = (feesInStx / payouts.info.theoreticalStxRewards) * 100;
  const feesPercentageFormatted = feesPercentage.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
  // Compose markdown
  const md = `---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of ${totalBtcAfterFees} BTC to the proxy address.

We distributed ${distributedBtc} BTC to pool members who registered for BTC rewards and ${reserveBtc} BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of ${(parseFloat(totalBtcAfterFees) - parseFloat(distributedBtc) - parseFloat(reserveBtc)).toFixed(8)} BTC were swapped to ${stxPartRewards} STX in ${swapTxs.length} transactions using simpleswap.

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
    if (isSwapTx(tx)) {
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
    } else {
      return `<li>${tx.txid} (${btcFromSats(tx.vout[0].value)} BTC)</li>`;
    }
  })
  .join('\n')}
</ul>

### Compensation as Stacks Signer after Nakamoto Release (${feesPercentageFormatted}% reserve)

{{% reserve cycle="${cycleId}" satstoreserve="${payouts.transferBtc.outputs[1].rewards}"
stackedstxforstx="${stackedStxSTXReceivers}" swappedsats="${swappedSats}"
swappedstx="${swappedStx / 1e6}" totalstx="${theoreticalStxRewards}" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle ${cycleId}](/img/cycles/${cycleId}-simpleswap.png)
`;

  fs.writeFileSync(outputFile, md);
  console.log(`Generated ${outputFile}`);
}

async function getBtcData() {
  // Get latest transactions
  // const [proxyTxs] = await Promise.all([
  //   //getLatestTx(FAST_POOL_V1),
  //   //getLatestTx(FAST_POOL_V2),
  //   getLatestTxs(PROXY_ADDRESS),
  // ]);
  // return proxyTxs;
  return txsProxy109;
}

async function getStxSwapTransactions(cycleId: number) {
  // Get latest transactions
  const res = await accountsApi.getAccountTransactionsWithTransfers({
    principal: 'SP3KJBWTS3K562BF5NXWG5JC8W90HEG7WPYH5B97X',
  });
  const txs = res.results;

  const firstConsolidationPossible = 666050 + cycleId * 2100 + 500;
  const txsWithTransfers = txs.filter(
    tx =>
      BigInt(tx.stx_received) > 0n &&
      (tx.tx as any).burn_block_height > firstConsolidationPossible &&
      // try to filter only transfers from simple swap
      (tx.tx as any).tx_type === 'token_transfer' &&
      ((tx.tx as any).token_transfer.memo as string).startsWith('0x313131') &&
      (tx.tx as any).tx_status === 'success'
  );
  txsWithTransfers.reverse();
  return txsWithTransfers;
}

const generateMd = async (cycleId: number) => {
  const [proxyTxs, stxSwapTxs] = await Promise.all([getBtcData(), getStxSwapTransactions(cycleId)]);
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

generateMd(109).catch(console.error);
