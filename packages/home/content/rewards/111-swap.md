---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 1.26929634 BTC to the proxy address.

We distributed 0.23712613 BTC to pool members who registered for BTC rewards and 0.05723392 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of 0.97493629 BTC were swapped to 158,235.087339 STX in 2 transactions using simpleswap.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.74324561"
  btctx="https://mempool.space/tx/1e3f734c28a8a8b2aa5292c7489bd169eb3c05fb0fd98057629f468c6cc8b185" %}}

{{% toproxy btc="0.36929092"
  btctx="https://mempool.space/tx/690237e146f2b8887f59f85eb296e5b745c495c07ff25cf7fc6a6eb58fe18919" %}}

</ul>

Transactions for Fast Pool v2:

<ul>

{{% toproxy btc="0.15675981"
  btctx="https://mempool.space/tx/3c96cfb76d4ba0ec6c5914868cc2470241c1447ffddaee276517d629e3ad5ee7" %}}

</ul>
Transactions to and from proxy address:

<ul>
{{% payoutbtc members="0.23712613" reserve="0.05723392"
  btctx="https://mempool.space/tx/02f1bea5daa93edc4c1c4e782a45b1f1fff1f0406c9837302278f1c7b1028755" %}}
  
{{% swap btc="0.50000000" stx="81,351.283266"
  btctx="https://mempool.space/tx/deb16873b22cc3efc8832005bdafcd05ba41178ca82fd782649448825e08ee30"
  stxtx="0x1ce3a69fb8a3677314bed3ee0c52f1fec1fddac805c61dc5e9ae39f38fd9dc82" %}}

{{% swap btc="0.47492721" stx="76,883.804073"
  btctx="https://mempool.space/tx/d263bdace37cba7d397c13a73038b64461cb084436563905b596deff09f61ba8"
  stxtx="0xd78bbbf3e99a2469cc41a59a118cd808debaca77aa7f4554aaf806c46ba1bd46" %}}

</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.7% reserve)

{{% reserve cycle="111" satstoreserve="5723392"
stackedstxforstx="47332243.840089" swappedsats="97492721"
swappedstx="158235.087339" totalstx="196620.240538" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 111](/img/cycles/111-simpleswap.png)
