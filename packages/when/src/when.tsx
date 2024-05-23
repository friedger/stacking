import {
  Configuration,
  CoreNodeInfoResponse,
  CoreNodePoxResponse,
  InfoApi,
  StackingApi,
} from "@stacks/blockchain-api-client";
import { createSignal, createResource, Switch, Match, Show } from "solid-js";
import { PoxTimeline } from "./pox-timeline";
import { PoxChart } from "./pox-chart";
import { detailsFastPool } from "./data-fastpool";
import { detailsLisa } from "./data-lisa";
const basePath = "https://api.hiro.so"; //"http://192.168.0.208:3999"
const config = new Configuration({ basePath });
const infoApi = new InfoApi(config);

const fetchPoxInfo = async (id: number) => {
  const responsePox = await infoApi.getPoxInfo();
  const responseCore = await infoApi.getCoreApiInfo();
  return { responsePox, responseCore };
};

export const When = () => {
  const [cycleId, setCycleId] = createSignal<number>();
  const [poxInfo] = createResource(cycleId, fetchPoxInfo);
  setCycleId(0);
  const getCurrentHeight = (info: {
    responsePox: CoreNodePoxResponse;
    responseCore: CoreNodeInfoResponse;
  }) => {
    return (
      info.responseCore.burn_block_height -
      info.responsePox.first_burnchain_block_height -
      info.responsePox.reward_cycle_length * info.responsePox.reward_cycle_id
    );
  };
  return (
    <div class="min-h-full">
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Show when={poxInfo.loading}>
            <p class="px-4 sm:px-0">Loading...</p>
          </Show>
          <Switch>
            <Match when={poxInfo.error}>
              <p class="px-4 sm:px-0">Error: {poxInfo.error()}</p>
            </Match>
            <Match when={poxInfo()}>
              <>
                <div class="grid place-items-center">
                  <PoxChart
                    currentHeight={getCurrentHeight(poxInfo()!)}
                    details={detailsFastPool}
                  />
                </div>
              </>
            </Match>
          </Switch>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <p class="px-4 sm:px-0">
            All events of Fast Pool during a stacking cycle
          </p>
          <Show when={poxInfo.loading}>
            <p class="px-4 sm:px-0">Loading...</p>
          </Show>
          <Switch>
            <Match when={poxInfo.error}>
              <p class="px-4 sm:px-0">Error: {poxInfo.error()}</p>
            </Match>
            <Match when={poxInfo()}>
              <PoxTimeline poxInfo={poxInfo()!} />
            </Match>
          </Switch>
        </div>
      </main>
    </div>
  );
};
