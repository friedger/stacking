---
---

### Consolidation and Swapping

We consolidated the rewards address continuously and transferred a total of 1.44129890 BTC to the proxy address.

We distributed 0.26834934 BTC to pool members who registered for BTC rewards and 0.06499372 BTC to the Fast Pool reserve (fees for all pool members, 4.5%).

The remaining BTC of 1.10794368 BTC were swapped to 132,798.082168 STX in 2 transactions using simpleswap.

Transactions for Fast Pool v1:

<ul>

{{% toproxy btc="0.50058706"
  btctx="https://mempool.space/tx/5bf254b143001463522eab9ae7b82bab70bc4444217796418f2a2c598cae8167" %}}

{{% toproxy btc="0.75643251"
  btctx="https://mempool.space/tx/24019f0701acbbba2bc1c2b87ff120376a9045711d98436943b2b4742b0e54a7" %}}

</ul>

Transactions for Fast Pool v2:

<ul>

{{% toproxy btc="0.18427933"
  btctx="https://mempool.space/tx/8e00bde36fc8d32d28dc16c365b7a7af93a40604ffa48c90ff7ce9af31eb254f" %}}

</ul>

Transactions to and from proxy address:

<ul>
{{% swap btc="0.50000000" stx="58,261.397473"
  btctx="https://mempool.space/tx/cde66d3b7bcb5130b386ce9ea2531dbe4b69cc5ea337be4fb528ed787f38cd50"
  stxtx="0xd32c0ca4d4e1d56bbe879b5bdac3fabf62e97c97ef756895228e8be69df64753" %}}

{{% payoutbtc members="0.26834934" reserve="0.06499372"
  btctx="https://mempool.space/tx/4bac75bcf87aa3d4753c6002ae076d875f6a048c30906585937ffff82a3ab5da"
  %}}

{{% swap btc="0.60794368" stx="74,536.684695"
  btctx="https://mempool.space/tx/59518809a18ce8728d24a22ab54d5b89ae221c3ef21f78e55bfc5fe1a570049a"
  stxtx="0x0318f22bdf10866d281923eac4be3ed9e000f766e40941846bcc365632c0fba5" %}}

</ul>

### Compensation as Stacks Signer after Nakamoto Release (4.7% reserve)

{{% reserve cycle="108" satstoreserve="6499372"
stackedstxforstx="47535296.367713" swappedsats="110794368"
swappedstx="132798.082168" totalstx="164875.040318" %}}

### Swapping using Simpleswap

A screenshot of simpleswaps is shown below.

![Simpleswap cycle 108](/img/cycles/108-simpleswap.png)
