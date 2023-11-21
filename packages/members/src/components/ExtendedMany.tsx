import {
  ClarityType,
  ListCV,
  PrincipalCV,
  ResponseCV,
  TupleCV,
  UIntCV,
  cvToString,
  hexToCV,
} from '@stacks/transactions';
import { Box, Stack, Text } from '@stacks/ui';
import { useEffect, useState } from 'react';
import { getDelegateStackStxManyTxs } from '../lib/fpTxs';
import { toHumanReadableStx } from '../lib/unit-converts';

function errValueToString(value: UIntCV) {
  if (value.value === BigInt(9000)) {
    return 'Revoked (9000)';
  } else if (value.value === BigInt(603)) {
    return 'Duplicate (603)';
  } else if (value.value === BigInt(21000)) {
    return 'End of membership (21000)';
  } else {
    return `Error ${cvToString(value)}`;
  }
}

function okValueToString(value: TupleCV) {
  return `${toHumanReadableStx((value.data['lock-amount'] as UIntCV).value)} locked until ${(
    value.data['unlock-burn-height'] as UIntCV
  ).value.toString()}`;
}

function Result({
  tx,
}: {
  tx: { contract_call: { function_args: { hex: string }[] }; tx_result: { hex: string } };
}) {
  const stackersCV = hexToCV(tx.contract_call.function_args[0].hex) as any as ListCV<PrincipalCV>;

  const results = tx.tx_result
    ? (hexToCV(tx.tx_result.hex) as any).value.data['locking-result'].list.map((r: ResponseCV) =>
        r.type === ClarityType.ResponseOk
          ? okValueToString(r.value as TupleCV)
          : errValueToString(r.value as UIntCV)
      )
    : Array(stackersCV.list.length).fill('pending');
  const stackers = stackersCV.list.map((arg: PrincipalCV) => cvToString(arg));

  return (
    <>
      {stackers.map((s, index) => (
        <Stack key={index}>
          <Text textStyle={'body.small'}>
            <a href={`/u/${s}`}>{s}</a>: {results[index]}
          </Text>
        </Stack>
      ))}
    </>
  );
}

export function ExtendedMany() {
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    getDelegateStackStxManyTxs().then(transactions => setTxs(transactions));
  }, [setTxs]);

  return (
    <Box p="loose">
      <Text textStyle={'body.large'}>Delegated Stack Stx Many</Text>
      {txs.map((tx, index) => (
        <Box p="loose" key={index}>
          <Text textStyle={'body.large.medium'} mb="base-tight">
            <a href={`https://explorer.hiro.so/txid/${tx.tx_id}`}>
              {tx.sender_address} {tx.block_height}
            </a>
          </Text>
          <Result tx={tx} />
        </Box>
      ))}
    </Box>
  );
}
