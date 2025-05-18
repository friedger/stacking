---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 1.75537355 BTC to the proxy address.

We distributed 0.32419129 BTC to pool members who registered for BTC rewards and 0.08791900 BTC to the Fast Pool reserve (fees for all pool members).

The remaining BTC of 1.34326326 BTC were swapped to 151,309.363574 STX in 2 transactions using simpleswap.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.83992286"
  btctx="https://mempool.space/tx/a0175dc8d66e874c9c58e57202f34167cc28eb5c4da4711545881a9f544f69db" %}}

{{% toproxy btc="0.72004081"
  btctx="https://mempool.space/tx/5afba43fce1e6d09a1929b630d717f9c5b92eb192d022c8ab3b54e3643da2354" %}}

</ul>

Transactions for Fast Pool v2:

<ul>

{{% toproxy btc="0.19540988"
  btctx="https://mempool.space/tx/ed2d284e27ff2371bd800ba5f8f393def6a98e0c1d81774ab83bd65143a53441" %}}

</ul>
Transactions to and from proxy address:

<ul>
{{% swap btc="0.50000000" stx="56,258.416244"
  btctx="https://mempool.space/tx/798db8e94caaa3aeb25584a964d9c323e7a8fcfcb0b75d189bd03756fac2d7a8"
  stxtx="0x2c9d89811594e1aa8a86189cd1ab333310405c2d7a3ee13283d5c4ce19072dc7" %}}

{{% payoutbtc members="0.32419129" reserve="0.08791900"
  btctx="https://mempool.space/tx/73910879c06e9bb43bb8a00b1b191af7b6f16ac35b2815e8a0cf41bc7c420847" %}}

{{% swap btc="0.84325023" stx="95,050.94733"
  btctx="https://mempool.space/tx/bf4a54846da42315f676d043b915d5058bcf16c78c8cdb4d9c05cc1aff9b6811"
  stxtx="0x53534ca4c9e9d9232787c4ea484a4acd2a86ed7af83a58c831c3f72cad76d16f" %}}

</ul>

### Compensation as Stacks Signer after Nakamoto Release (5.3% reserve)

{{% reserve cycle="109" satstoreserve="8791900"
stackedstxforstx="47681323.604807" swappedsats="134325023"
swappedstx="151309.363574" totalstx="187745.731789" %}}

With 5.3% the fees were higher than the usual 4.7%. When we distributed rewards, our standard Stacks node had a failure and we used our fallback node that used an older script for the calculations. For the next cycle, we will reduce the fees to compensate for this.

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 109](/img/cycles/109-simpleswap.png)
