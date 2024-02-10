import React, { useRef, useState } from 'react';
import { StacksMainnet } from "@stacks/network";
import { createHandleSubmit as createHandleSubmitAllowFastPool } from '../lib/utils-allow-contract-caller';
import { createHandleSubmit as createHandleSubmitDelegateStx } from '../lib/utils-delegate-stx';
import { StackingClient } from '@stacks/stacking';

export default function DelegateAction({ address }) {
    const amountRef = useRef();
    const [suggestedAmount, setSuggestedAmount] = useState(250);

    const network = new StacksMainnet();
    const client = new StackingClient(address, network);

    const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);

    const setHasUserConfirmedPoolWrapperContract = () => { return false };

    const handleAllowFastPool = createHandleSubmitAllowFastPool({ client, network, setIsContractCallExtensionPageOpen });

    const handleDelegateStx = createHandleSubmitDelegateStx({ client, network, setIsContractCallExtensionPageOpen, amountRef });

    return (
        <div className="DelegateAction">

            <div >
                <p>
                    To join the pool, you need to allow Fast pool to manage your stacking. This needs to be done only once.
                </p>
                <p>
                    <button className="btn btn-outline-primary" type="button"
                        onClick={handleAllowFastPool}>
                        Allow Fast Pool to manage your stacking
                    </button>
                </p>
                <p>
                    To delegate, enter the delegation Amount (can be more than your balance) and confirm the transaction.
                </p>
                <p>
                    <input
                        ref={amountRef}
                        defaultValue={suggestedAmount}
                        placeholder={`${suggestedAmount}`}
                    /> STX
                </p>

                <p>
                    <button className="btn btn-outline-primary" type="button" onClick={handleDelegateStx}>
                        Delegate now
                    </button>
                </p>
            </div>
        </div>
    );
}
