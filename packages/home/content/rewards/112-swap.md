---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 1.30364528 BTC to the proxy address.

We distributed 0.28758390 BTC to pool members who registered for BTC rewards and 0.06737355 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of 0.64068384 BTC were swapped to 183,486.076376 STX in 2 transactions using simpleswap.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.50000000"
  btctx="https://mempool.space/tx/a47553f98ecef12b6a4051088bad854d486d7288570b4331f0033017d2a2b1db" %}}

{{% toproxy btc="0.50000000"
  btctx="https://mempool.space/tx/e45d15fbdc1b6aa151e62e77b8213dee7891d0141056e49f30dc125cbf33ce45" %}}

{{% toproxy btc="0.30364528"
  btctx="https://mempool.space/tx/e04bb07dae7d3f081128e91caa12b1c69472a6390ce9e02aca7111becfd30e3a" %}}

</ul>

Transactions for Fast Pool v2:

<ul>

{{% toproxy btc="0.19108146"
  btctx="https://mempool.space/tx/084defb600557a4803c975d3eaddcd1dd88271a78df6a1aa594a4324f0cbd974" %}}

</ul>
Transactions to and from proxy address:

<ul>
{{% payoutbtc members="0.28758390" reserve="0.06737355"
  btctx="https://mempool.space/tx/b700a6f73a3fd60cf1acb6f85de8ee982a95247a8626e81b33bd52c73e06fd05" %}}
  
{{% swap btc="0.50000000" stx="78,807.539462"
  btctx="https://mempool.space/tx/2452d6c6610015d4681017d0ab5dfad4acfb39ab82ad95bec0f5fb88da1cd651"
  stxtx="0xf8dbab1bee807f5d0e9991007b5e75ba0f61d9ffcd3107b653ff7ccd1227fa9a" %}}

{{% swap btc="0.63976107" stx="104,678.536914"
  btctx="https://mempool.space/tx/625c27b1062f2a86176521fd8dfb6f40e48ebd1e593efd74ed1472850eea0384"
  stxtx="0x023c57010877e17719e14cb5387b8eff255e334dbdb0d9336949b113cbe2c04e" %}}

</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.7% reserve)

{{% reserve cycle="112" satstoreserve="6737355"
stackedstxforstx="45604481.537083" swappedsats="113976107"
swappedstx="183486.076376" totalstx="229683.012322" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 112](/img/cycles/112-simpleswap.png)
