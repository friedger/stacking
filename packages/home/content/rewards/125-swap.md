---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 0.54959216 BTC to the proxy address.

We distributed 0.10459194 BTC to pool members who registered for BTC rewards and 0.02478971 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of 0.42021051 BTC were wrapped 0.42019612 sBTC in 2 transaction.

We swapped 0.41631780 BTC to 125,962.239975 STX using the sBTC-STX liquidity pools on the Stacks blockchain.

The amount of 0.00389271 sBTC was sent to the users as sBTC rewards.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.29663340"
  btctx="https://mempool.space/tx/56254794714a106fe57d8fda71076282a6aa2b9f400b284368d9194f190873d7" %}}
  

{{% toproxy btc="0.16108126"
  btctx="https://mempool.space/tx/808e255f376a96bffaefebdeef93ce5d797db440ebe76256f946adb3eda18b1c" %}}
  
</ul>

Transactions for Fast Pool v2:

<ul>

{{% toproxy btc="0.09187750"
  btctx="https://mempool.space/tx/86470ef32e1f02fd3e914d9c011e8b48a0f5e2dfb155e6b557380c9f516f65ea" %}}
  
</ul>
Transactions to and from proxy address:

<ul>
{{% wrap btc="0.29663140"
  btctx="https://mempool.space/tx/2326407b213de04c2082ca66e32f930958747c21fd2a95d241326345a955c992" stxtx="0x2de07156f407c816921603a39cc1530b3bab4a82023e8e2d39be6d0f04d7ac4a" %}}
  
{{% payoutbtc members="0.10459194" reserve="0.02478971"
  btctx="https://mempool.space/tx/25adbc9181b06c077fdbe5b9bb7daed52f5fd4f605937ba479c00de2a5ad1807" %}}
  
{{% wrap btc="0.12357271"
  btctx="https://mempool.space/tx/56f2ec52be769c26c0530fcc55e08100910d4310ca681aed63a1bd0bfa727e39" stxtx="0x96efec6f7076683c6684e84256eb28c14faa9c199e0e36abe38a50cb51c82c4d" %}}
  
</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.7% reserve)

{{% reserve cycle="125" satstoreserve="2478971"
stackedstxforstx="45904536.430342" swappedsats="41631780"
swappedstx="125962.239975" totalstx="158477.075398" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 125](/img/cycles/125-simpleswap.png)

### Swapping using sBTC-STX Pools
We swapped 0.41631780 BTC to 125,962.239975 STX using the sBTC-STX liquidity pools on the Stacks blockchain.

<ul>

{{% swapSbtcToStx sbtc="0.05000000" stx="17,676.005525"
  stxtx="0x8bed185e69b79df9675a16a32e6f174c67b453d75ae8c556bc72de684f40aac5" %}}
  

{{% swapSbtcToStx sbtc="0.05000000" stx="17,489.927095"
  stxtx="0xe6982e13c6d05d1cf262467f0f4cf8b0638335a9b5cacb00a3a712e2a9565071" %}}
  

{{% swapSbtcToStx sbtc="0.05000000" stx="17,485.673043"
  stxtx="0x1de697a2ce5f2aeb8a7b086251148c5e571de6ddfa40e2f6002d24c277d15c8a" %}}
  

{{% swapSbtcToStx sbtc="0.05000000" stx="17,254.388026"
  stxtx="0xc264457dcfa45f822ea5e4c0240b15870cf5c0c217fd17a086e4c527fc55f558" %}}
  

{{% swapSbtcToStx sbtc="0.05000000" stx="13,092.233685"
  stxtx="0x64eee3a3358080f1458b5208c631babb714a0a1c3d610f226f47b58ee3bac2a3" %}}
  

{{% swapSbtcToStx sbtc="0.04274818" stx="11,209.401397"
  stxtx="0xe2b1a9a3c273fd1ee5314c67a1e6b57205a43057f8dcd7d4e79327369d8140ab" %}}
  

{{% swapSbtcToStx sbtc="0.05000000" stx="12,849.575595"
  stxtx="0xaf35775c3836912d219f200963bf8e2dace64ad194912d37ae7dca24907706b1" %}}
  

{{% swapSbtcToStx sbtc="0.07356962" stx="18,905.035609"
  stxtx="0x75c632eb605f34b6a6e79220a152ae90e756f3aeb4e157d499234048bd3b22da" %}}
  
</ul>
