import { Dispatch, SetStateAction } from 'react';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';
import { noneCV, principalCV } from '@stacks/transactions';
import { stackingContract } from './delegation';

function getOptions(
  stackingContract: string,
  poolContract: string,
  network: StacksNetwork
): ContractCallRegularOptions {
  const [contractAddress, contractName] = stackingContract.split('.');
  const functionArgs = [principalCV(poolContract), noneCV()];
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
  network: StacksNetwork;
  poolContract: string;
  setIsContractCallExtensionPageOpen: Dispatch<SetStateAction<boolean>>;
}
export function createHandleSubmit({
  network,
  poolContract,
  setIsContractCallExtensionPageOpen,
}: CreateHandleSubmitArgs) {
  return async function handleSubmit({ onFinish }: HandleAllowContractCallerArgs) {
    // TODO: handle thrown errors

    const allowContractCallerOptions = getOptions(stackingContract, poolContract, network);

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
