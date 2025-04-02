---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 1.22774805 BTC to the proxy address.

We distributed 0.25054894 BTC to pool members who registered for BTC rewards and 0.05524866 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of 0.92195045 BTC were swapped to 114,328.583976 STX in 2 transactions using simpleswap.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.57611287"
  btctx="https://mempool.space/tx/f760f7dd42038fa01cf737360fd47eede3fa18639de0ebdd982c88fd72db27b6" %}}

{{% toproxy btc="0.60673090"
  btctx="https://mempool.space/tx/179405f3692394ce63539315665e6f66a03523bec7f047f543c052863b70af7a" %}}

</ul>

Transactions for Fast Pool v2:

<ul>
{{% toproxy btc="0.04490428"
btctx="https://mempool.space/tx/229f9666f16c6f2f655b47db24c2d6284bc14fcb418e6a8cff97e5ed82622f97" %}}

</ul>

Transactions to and from proxy address:

<ul>
{{% swap btc="0.57611068" stx="66,475.946786"
  btctx="https://mempool.space/tx/81e92aa5b848282936f691dfb4efae77a210ca7efc8ff42f4600722da81632eb"
  stxtx="0x4d6f0da26b17f298901671a4ad607464591bdb98fbc806146e5958f3a70567af" %}}

{{% payoutbtc members="0.25054894" reserve="0.05524866"
  btctx="https://mempool.space/tx/2791fb22389f62bbc6c487b89237dc33e26c48b93915597ede22f732a6215963"
  %}}

{{% swap btc="0.34582786" stx="47,852.63719"
  btctx="https://mempool.space/tx/46114eb5a082ce71e0ccfd44ae87ca068e22c0b4aeea9211988352c488bce4f4"
  stxtx="0x2448a0aa060b2a298d8a86172c8981bf0183813389b45f8f60b66a476e562311" %}}

</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.7% reserve)

{{% reserve cycle="106" satstoreserve="5524866"
stackedstxforstx="42250568.404125" swappedsats="92195045"
swappedstx="114328.583976" totalstx="145398.483509" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 106](/img/cycles/106-simpleswap.png)
