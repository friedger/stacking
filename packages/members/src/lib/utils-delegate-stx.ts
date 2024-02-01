import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StacksNetwork, StacksNetworkName } from '@stacks/network';
import { PoxInfo, StackingClient, poxAddressToTuple } from '@stacks/stacking';
import { noneCV, someCV, uintCV } from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { fastPoolContract, stxToMicroStx } from './delegation';
import { InputElementProps, InputProps, InputPropsBase } from '@stacks/ui';

function getOptions(
  amount: string,
  network: StacksNetwork
): ContractCallRegularOptions {

  const [contractAddress, contractName] = fastPoolContract.split(".");
  const functionArgs = [uintCV(stxToMicroStx(amount).toString())]
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
  amountRef: React.MutableRefObject<InputProps>
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
