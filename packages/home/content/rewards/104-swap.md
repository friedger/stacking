---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 1.50077577 BTC to the proxy address and miner address.

We distributed 0.31385535 BTC to pool members who registered for BTC rewards and 0.07015061 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The total of 0.98925703 BTC was used by the miner to converted to STX. We bid for 652 blocks between block 885135 and 886014. We received 103,716.256362 STX as rewards.

The remaining BTC and some utxos from the miner (0.00105032 BTC), in total 0.17124592 BTC were swapped to 21,002.697275 STX in 1 transactions using simpleswap.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.22377036"
  btctx="https://mempool.space/tx/c2d60e1556e0d1a71141b6b3dda53c9155a26c304f5158e8d818ee82363c24a2" %}}

{{% toproxy btc="0.36545934"
  btctx="https://mempool.space/tx/61ee810aee167f572e87c4b0f88e9ef27275ad390b615019e43c5c15066f781d" %}}

{{% toproxy btc="0.40107765"
btctx="https://mempool.space/tx/e7d17b72b270ed88fc8d41e75be92de0d399128ff786195158ad17cebb0c7f03"%}}

{{% toproxy btc="0.51046842"
btctx="https://mempool.space/tx/a6b66fb3e800f7b8fb8a8919b75b534b8925959f8af9f0146368ac1f8e2af716" %}}

</ul>

Transactions for Fast Pool v2:

<ul>
{{% toproxy btc="0.04374178"
btctx="https://mempool.space/tx/481f67e8761989e6eda2501078aeefd5978c69efc6e4fbd4c0d21623ca9c9c14" %}}

</ul>

Transactions to and from proxy address:

<ul>
{{% payoutbtc members="0.31385535" reserve="0.07015061"
  btctx="https://mempool.space/tx/de88d67898aca7a1d51d49cd1610926070038fb8831ee8270289ff58b16c4208"
  %}}

{{% swap btc="0.17124592" stx="21,002.697275"
  btctx="https://mempool.space/tx/f43c014237c8a4bd560728a33286e3d1a313ec75d6a59fdd2f292ea67a0322dd"
  stxtx="0xf632f68a6eb6dbdf876ce2fcf3838ac759546df0a3e986529dbcc3981ec217d7" %}}

<li>
  <p>0.00105032 BTC were returned from miner at the end of the cylce:</p>
  <ul>
    <li>
      <a target="_blank" rel="noopener noreferrer nofollow" href="https://mempool.space/tx/e70039a29d4f084784cb3711783847409b4b708ac245f59a16778b62dbeb8070"
        >https://mempool.space/tx/e70039a29d4f084784cb3711783847409b4b708ac245f59a16778b62dbeb8070</a
      >
    </li>    
  </ul>
</li>
</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.8% reserve)

{{% reserve cycle="104" satstoreserve="7015061"
stackedstxforstx="42982102.564259" swappedsats="116155327"
swappedstx="124718.952919" totalstx="158035.684290" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 104](/img/cycles/104-simpleswap.png)
