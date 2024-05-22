import { Dispatch, SetStateAction } from 'react';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import { uintCV } from '@stacks/transactions';
import { InputProps } from '@stacks/ui';
import { fastPoolContract, stxToMicroStx } from './delegation';

function getOptions(amount: string, network: StacksNetwork): ContractCallRegularOptions {
  const [contractAddress, contractName] = fastPoolContract.split('.');
  const functionArgs = [uintCV(stxToMicroStx(amount).toString())];
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
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
  amountRef: React.MutableRefObject<InputProps>;
}
export function createHandleSubmit({
  client,
  network,
  setIsContractCallExtensionPageOpen,
  amountRef,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit() {
    // TODO: handle thrown errors
    const [poxInfo, stackingContract] = await Promise.all([
      client.getPoxInfo(),
      client.getStackingContract(),
    ]);

    const delegateStxOptions = getOptions(amountRef.current.value as string, network);

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
