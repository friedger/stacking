---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 0.96955781 BTC to the proxy address.

We distributed 0.19612552 BTC to pool members who registered for BTC rewards and 0.04857125 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of 0.72484944 BTC were swapped to 103,424.580485 STX in 2 transactions using simpleswap.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.50524557"
  btctx="https://mempool.space/tx/6852ea46ce26eb174fcc241278f78d5fcb301e4ed4fba833227b2326f307b66c" %}}

{{% toproxy btc="0.43114008"
  btctx="https://mempool.space/tx/ac026f871cb57052be22272b6250c7e4fecef2455073a29e7e7f35a50ab5ee3c" %}}

</ul>

Transactions for Fast Pool v2:

<ul>

{{% toproxy btc="0.03317216"
  btctx="https://mempool.space/tx/83ea0fa951fe33868d05e93aec145300a74c0731bfe331e0d081600f42d5f45c" %}}

</ul>

Transactions to and from proxy address:

<ul>
{{% swap btc="0.50000000" stx="71,475.547056"
  btctx="https://mempool.space/tx/2e4fe9f8992a828fa067cddf4b47f693bbffc2fa515d7510e69a69eae7214d11"
  stxtx="0xf351310b09d3b0d0bb7a1f6bcbff6fb5b4c269b329906bdb19c5e27be7e87d0c" %}}

{{% payoutbtc members="0.19612552" reserve="0.04857125"
  btctx="https://mempool.space/tx/d9781ed5be64a27085491c9d31088f7ee5dccb1af295ae6dec0ceea5b1feac72"
  %}}

{{% swap btc="0.22484944" stx="31,949.033429"
  btctx="https://mempool.space/tx/080dcc809441d737b5b28db01b3079d2d9ae553abbcb524caee875774ba17656"
  stxtx="0xf86873653959358edf632b7c06cb9aa122d00c88a58fcd2f7e81d226f41d5510" %}}

<li>
  <p>765.905265 STX were used from the reserve to return fees due to low rewards during this cycle. The usual fees in BTC of 4.5% turned into 5.3% in STX. Therefore the corresponding STX of 536133 sats were returned to reduce to the usual 4.7% in STX:</p>
  <ul>
    <li>
      <a target="_blank" rel="noopener noreferrer nofollow" href="https://explorer.hiro.so/txid/31178a6dafbc22992659f9de2cead609f9fbe85f68435ccbbb240734e92adb5c?chain=mainnet"
        >31178a6dafbc22992659f9de2cead609f9fbe85f68435ccbbb240734e92adb5c</a
      >
    </li>   
    
  </ul>
</li>
</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.7% reserve)

{{% reserve cycle="107" satstoreserve="4320992"
stackedstxforstx="42544357.159021" swappedsats="72484944"
swappedstx="103424.580485" totalstx="131337.122026" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 107](/img/cycles/107-simpleswap.png)
