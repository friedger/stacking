---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 1.05278165 BTC to the proxy address.

We distributed 0.20588180 BTC to pool members who registered for BTC rewards and 0.04745553 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of 0.79944432 BTC were swapped to 114,549.381536 STX in 2 transactions using simpleswap.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.52736933"
  btctx="https://mempool.space/tx/93bfb0fd5b899a31213fef45fae741a2c9e04f823da81f51cd245b348bac39f7" %}}
  

{{% toproxy btc="0.38804556"
  btctx="https://mempool.space/tx/d712ca6c2fd921163d9dde6d7baa387791280d7bbccdb6df6baeba6fcabf43b0" %}}
  
</ul>

Transactions for Fast Pool v2:

<ul>

{{% toproxy btc="0.13736676"
  btctx="https://mempool.space/tx/5d8184110510554fd4c44a5c0c64ec7247eea512dd78034a927a18e9c082d813" %}}
  
</ul>
Transactions to and from proxy address:

<ul>
{{% payoutbtc members="0.20588180" reserve="0.04745553"
  btctx="https://mempool.space/tx/114fdef7d626b9d9c780dcacfdc978ad49f58b3a28ff49bdecad74d64f73ec0b" %}}
  
{{% swap btc="0.50000000" stx="71,417.221588"
  btctx="https://mempool.space/tx/40845d92dbbbbd317bccb39d69b53f08d5b1ed360a7fe5f1f6c55d989779b457"
  stxtx="0xe800bff9325fe324b7a38f0d2fbce784c23e222d4b30389f7d0dfa6ec002baeb" %}}

{{% swap btc="0.29942761" stx="43,132.159948"
  btctx="https://mempool.space/tx/28f829995276b4b33ec0452dcd28f7289d4abfbe61c8535fc517c4b8ae5857cd"
  stxtx="0x3473bad07d2efaf0cbcf7e3919d0a0b467e8d704e92d227df43764ffbc33f79a" %}}

</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.7% reserve)

{{% reserve cycle="113" satstoreserve="4745553"
stackedstxforstx="44684499.313937" swappedsats="79942761"
swappedstx="114549.381536" totalstx="143983.662629" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 113](/img/cycles/113-simpleswap.png)
