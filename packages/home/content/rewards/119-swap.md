---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 1.03440710 BTC to the proxy address.

We distributed 0.19103984 BTC to pool members who registered for BTC rewards and 0.04662832 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining amount of 0.79673894 BTC was wrapped to sBTC.

We swapped 0.79179015 sBTC to 155,846.97736 STX and distributed the tokens as STX rewards.

The amount of 0.00493829 sBTC was sent to users as sBTC rewards.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.59144416"
  btctx="https://mempool.space/tx/affc264bcdd9e754f1a30f085774f193f40b3befebe7f7b3426a9b7ad2efbcf0" %}}

{{% toproxy btc="0.29511041"
  btctx="https://mempool.space/tx/4554dcbc54f3dcdc040a55b406ec977d181b7a8f3550dfcb4aab145fd5724528" %}}

</ul>

Transactions for Fast Pool v2:

<ul>

{{% toproxy btc="0.14785253"
  btctx="https://mempool.space/tx/b78142a0ebb18559cdd4ca7079e4ca7262fdd2a5965cb8a2320f9e43bcd4cdb7" %}}

</ul>
Transactions to and from proxy address:

<ul>
{{% wrap btc="0.50000000"
  btctx="https://mempool.space/tx/bb49c70652983974f14f7972c92e0472dbf756c3023c0cf4ace2e8aeef9ceff3" stxtx="0x4267c1430b4e9290d53311f46dce33f9899d6faa32feb3056c25a291a447d694" %}}
  
{{% payoutbtc members="0.19103984" reserve="0.04662832"
  btctx="https://mempool.space/tx/ccde0fe76efce0622d5adb303af595c0e1d38baa280ea42e513734d64569d175" %}}
  
{{% wrap btc="0.29673213"
  btctx="https://mempool.space/tx/49e5c5efabe8055e4f0e292dc6d2ca4f49afce322f09af713a9e6b6050e93416" stxtx="0x1c5c7aca24fbf170e3c0137b8569bab932a95e8b26990c4d89664d48228d4845" %}}
  
</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.7% reserve)

{{% reserve cycle="119" satstoreserve="4662832"
stackedstxforstx="47696350.975155" swappedsats="79179015"
swappedstx="155846.97736" totalstx="194333.435532" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 119](/img/cycles/119-simpleswap.png)

### Swapping using sBTC-STX Pools

We swapped 0.79179015 BTC to 155,846.97736 STX using the sBTC-STX liquidity pools on the Stacks blockchain.

<ul>

{{% swapSbtcToStx btc="0.10000000" stx="19,468.451947"
  stxtx="0x66da34f43a7bfc84270eb6c1155cd55d12776f155f3dfa6784e7aa5d013b1cc7" %}}

{{% swapSbtcToStx btc="0.10000000" stx="19,352.627075"
  stxtx="0x793a4c421cd1e8ae8ba4bad1d246ecee62589ba45256a7040661e7966f15b669" %}}

{{% swapSbtcToStx btc="0.10000000" stx="19,310.418708"
  stxtx="0x198064f64d402cbcdffb3ca2332e0fc88a32538675a864054b798b8ecef51af4" %}}

{{% swapSbtcToStx btc="0.10000000" stx="19,246.845923"
  stxtx="0x9fcc76ed807f52942d2717fe700d510b3b6bc653cfde5662f67b7562facd1600" %}}

{{% swapSbtcToStx btc="0.10000000" stx="19,282.358055"
  stxtx="0xa3b19d2eb8561b9b651f36536f5692be74a4c4a4ca067b1ebb6046c5d88d0084" %}}

{{% swapSbtcToStx btc="0.10000000" stx="20,373.700205"
  stxtx="0x92871d244807ee71a6a8dda50224c4c9e1f43db746d49affe3491e4b9dee7993" %}}

{{% swapSbtcToStx btc="0.10000000" stx="20,202.609702"
  stxtx="0xe6110035b6ce7eeb93c094a72b48eb91832da7e33c358845ce69df852eb20bbc" %}}

{{% swapSbtcToStx btc="0.09672844" stx="19,624.968745"
  stxtx="0x27bd7a2fa85c15995475be3bca198cdcdf1f3424e93481cd20728560c58655a3" %}}

</ul>

<ul>

{{% swapStxToSbtc btc="0.00493829" stx="1,015.003"
  stxtx="0xb903087e411eb9f963889af5f8835db33342b0b0c66ee8f675fd0ebaf97a1597" %}}

</ul>
