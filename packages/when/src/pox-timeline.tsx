import {
  CoreNodeInfoResponse,
  CoreNodePoxResponse,
} from "@stacks/blockchain-api-client";
import { JSXElement } from "solid-js";

export const PoxTimeline = ({
  poxInfo,
}: {
  poxInfo: {
    responsePox: CoreNodePoxResponse;
    responseCore: CoreNodeInfoResponse;
  };
}) => {
  const { responsePox, responseCore } = poxInfo;
  const currentHeight = responseCore.burn_block_height;
  return (
    <Table>
      <Row>
        <Label>
          Current Cycle
          <br />
          Current Block Height
        </Label>
        <Value>
          {responsePox.reward_cycle_id}
          <br />
          <b>{responseCore.burn_block_height}</b>
        </Value>
      </Row>
      <BlockHeight
        label="Miners start PoX Cycle"
        height={
          responsePox.first_burnchain_block_height +
          responsePox.reward_cycle_length * responsePox.reward_cycle_id
        }
        currentHeight={currentHeight}
      />

      <BlockHeight
        label="Fast Pool ends rewards distribution"
        height={
          responsePox.first_burnchain_block_height +
          responsePox.reward_cycle_length * responsePox.reward_cycle_id +
          432
        }
        currentHeight={currentHeight}
      />

      <BlockHeight
        label="Fast Pool members can extend stacking"
        height={
          responsePox.first_burnchain_block_height +
          responsePox.reward_cycle_length * responsePox.reward_cycle_id +
          responsePox.reward_cycle_length / 2
        }
        currentHeight={currentHeight}
      />

      <BlockHeight
        label="Fast Pool aggregates partial commits (estimated)"
        height={
          responsePox.first_burnchain_block_height +
          responsePox.reward_cycle_length * responsePox.reward_cycle_id +
          (responsePox.reward_cycle_length / 3) * 2
        }
        currentHeight={currentHeight}
      />

      <BlockHeight
        label="Lisa closes for this cycle"
        height={
          responsePox.first_burnchain_block_height +
          responsePox.reward_cycle_length * responsePox.reward_cycle_id +
          responsePox.reward_cycle_length -
          400
        }
        currentHeight={currentHeight}
      />

      <BlockHeight
        label="Fast Pool closes for this cycle (estimated)"
        height={
          responsePox.first_burnchain_block_height +
          responsePox.reward_cycle_length * responsePox.reward_cycle_id +
          responsePox.reward_cycle_length -
          50
        }
        currentHeight={currentHeight}
      />
    </Table>
  );
};

const Table = ({ children }: { children: JSXElement }) => {
  return (
    <div class="mt-6 border-t border-gray-100">
      <dl class="divide-y divide-gray-100">{children}</dl>
    </div>
  );
};
const Row = ({ children }: { children: JSXElement }) => {
  return (
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      {children}
    </div>
  );
};
const Label = ({
  children,
  past,
}: {
  past?: boolean;
  children: JSXElement;
}) => {
  return (
    <dt
      class={`text-sm font-medium leading-6 ${
        past ? "text-gray-500" : "text-gray-900"
      }`}
    >
      {children}
    </dt>
  );
};
const Value = ({
  children,
  past,
}: {
  past?: boolean;
  children: JSXElement;
}) => {
  return (
    <dd
      class={`mt-1 text-sm leading-6 ${
        past ? "text-gray-500" : "text-gray-700"
      } sm:col-span-2 sm:mt-0`}
    >
      {children}
    </dd>
  );
};

const BlockHeight = ({
  label,
  height,
  currentHeight,
}: {
  label: string;
  height: number;
  currentHeight: number;
}) => {
  if (height < currentHeight) {
    return (
      <Row>
        <Label past>{label}</Label>
        <Value past>{height}</Value>
      </Row>
    );
  } else {
    return (
      <Row>
        <Label>{label}</Label>
        <Value>
          {height} <br />
          <p class="text-xs">
            in {height - currentHeight} blocks or{" "}
            {(((height - currentHeight) * 11) / (60 * 24)).toFixed(0)} days and{" "}
            {(
              ((height - currentHeight) * 11) / 60 -
              Math.floor(((height - currentHeight) * 11) / (60 * 24)) * 24
            ).toFixed(2)}{" "}
            hours
          </p>
        </Value>
      </Row>
    );
  }
};
