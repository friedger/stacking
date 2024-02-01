import { Dispatch, SetStateAction } from 'react';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import { noneCV, principalCV } from '@stacks/transactions';
import { fastPoolContract, stackingContract } from './delegation';

function getOptions(
  stackingContract: string,
  network: StacksNetwork
): ContractCallRegularOptions {
  const [contractAddress, contractName] = stackingContract.split('.');
  const functionArgs = [principalCV(fastPoolContract), noneCV()];
  return {
    contractAddress,
    contractName,
    functionName: 'allow-contract-caller',
    functionArgs,
    network,
  };
}

export interface HandleAllowContractCallerArgs {
  onFinish: () => void;
}
interface CreateHandleSubmitArgs {
  client: StackingClient;
  network: StacksNetwork;
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
}
export function createHandleSubmit({
  client,
  network,
  setIsContractCallExtensionPageOpen,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit({
    onFinish,
  }: HandleAllowContractCallerArgs) {
    // TODO: handle thrown errors

    const allowContractCallerOptions = getOptions(stackingContract, network);

    openContractCall({
      ...allowContractCallerOptions,
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
        onFinish();
      },
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
    setIsContractCallExtensionPageOpen(true);
  };
}
