import { Dispatch, SetStateAction } from 'react';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import { bufferCVFromString, uintCV } from '@stacks/transactions';
import { InputProps } from '@stacks/ui';
import { multiPoolContract, stxToMicroStx } from './delegation';

function getOptions(
  amount: string,
  poolContract: string,
  network: StacksNetwork
): ContractCallRegularOptions {
  const [contractAddress, contractName] = poolContract.split('.');
  const functionArgs =
    poolContract === multiPoolContract
      ? [uintCV(stxToMicroStx(amount).toString()), bufferCVFromString('')]
      : [uintCV(stxToMicroStx(amount).toString())];

  return {
    contractAddress,
    contractName,
    functionName: 'delegate-stx',
    functionArgs,
    network,
  };
}

interface CreateHandleSubmitArgs {
  client: StackingClient;
  network: StacksNetwork;
  poolContract: string;
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
  amountRef: React.MutableRefObject<InputProps>;
}
export function createHandleSubmit({
  client,
  network,
  poolContract,
  setIsContractCallExtensionPageOpen,
  amountRef,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit() {
    // TODO: handle thrown errors
    const [poxInfo, stackingContract] = await Promise.all([
      client.getPoxInfo(),
      client.getStackingContract(),
    ]);

    const delegateStxOptions = getOptions(amountRef.current.value as string, poolContract, network);

    openContractCall({
      ...delegateStxOptions,
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
      },
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
    setIsContractCallExtensionPageOpen(true);
  };
}
