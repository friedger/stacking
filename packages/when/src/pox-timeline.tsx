import {
  CoreNodeInfoResponse,
  CoreNodePoxResponse,
} from "@stacks/blockchain-api-client";
import { For, JSXElement } from "solid-js";

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
  const events = [
    {
      label: "Miners start PoX Cycle",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id,
    },
    {
      label: "Fast Pool ends rewards distribution",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id +
        432,
    },
    {
      label: "Fast Pool starts extending stacking, everyone can extend",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id +
        responsePox.reward_cycle_length / 2,
    },
    {
      label: "Fast Pool aggregates partial commits (estimated)",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id +
        (responsePox.reward_cycle_length / 3) * 2,
    },
    {
      label: "Lisa closes for next cycle",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id +
        responsePox.reward_cycle_length -
        400,
    },
    {
      label:
        "Fast Pool closes for next cycle (estimated), last aggregate partial commit",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id +
        responsePox.reward_cycle_length -
        200,
    },
    {
      label: "Begin of prepare phase, no more stacking possible",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id +
        responsePox.reward_cycle_length -
        100,
    },
    {
      label: "End of cycle",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id +
        responsePox.reward_cycle_length,
    },
    {
      label: "Automatic unlock (if locking period ended)",
      height:
        responsePox.first_burnchain_block_height +
        responsePox.reward_cycle_length * responsePox.reward_cycle_id +
        responsePox.reward_cycle_length +
        1,
    },
  ];
  let indexForCurrentHeight = events.findIndex((e) => e.height > currentHeight);
  if (indexForCurrentHeight < 0) {
    indexForCurrentHeight = events.length;
  }
  events.splice(indexForCurrentHeight, 0, {
    label: "Current block height",
    height: currentHeight,
  });

  return (
    <>
      <Table>
        <Row>
          <Label>Current Cycle</Label>
          <Value>{responsePox.reward_cycle_id}</Value>
        </Row>
        <For each={events}>
          {(event, index) => {
            return (
              <>
                <BlockHeight
                  label={event.label}
                  height={event.height}
                  currentHeight={currentHeight}
                />
              </>
            );
          }}
        </For>
      </Table>
    </>
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
  passed: passed,
}: {
  passed?: boolean;
  children: JSXElement;
}) => {
  return (
    <dt
      class={`text-sm font-medium leading-6 ${
        passed ? "text-gray-500" : "text-gray-900"
      }`}
    >
      {children}
    </dt>
  );
};
const Value = ({
  children,
  passed: passed,
}: {
  passed?: boolean;
  children: JSXElement;
}) => {
  return (
    <dd
      class={`mt-1 text-sm leading-6 ${
        passed ? "text-gray-500" : "text-gray-700"
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
        <Label passed>{label}</Label>
        <Value passed>{height}</Value>
      </Row>
    );
  } else if (height === currentHeight) {
    return (
      <Row>
        <Label>{label}</Label>
        <Value>{height === currentHeight ? <b>{height}</b> : height}</Value>
      </Row>
    );
  } else {
    const blocksLeft = height - currentHeight;
    const days = (blocksLeft * 10) / (60 * 24);
    const hours = (blocksLeft * 10) / 60 - Math.floor(days) * 24;
    return (
      <Row>
        <Label>{label}</Label>
        <Value>
          {height} <br />
          <p class="text-xs">
            in {blocksLeft} blocks or{" "}
            {days > 0 ? <>{days.toFixed(0)} days and </> : null}
            {hours.toFixed(2)} hours
          </p>
        </Value>
      </Row>
    );
  }
};
