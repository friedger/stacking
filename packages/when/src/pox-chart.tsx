import { Chart, Colors, Legend, Tooltip } from "chart.js";
import { Doughnut } from "solid-chartjs";
import { onMount } from "solid-js";

const dataDefault = [1050, 950, 100];
let sum = 0;
const dataSum = dataDefault.map((value) => {
  sum += value;
  return sum;
});

const labelsPast = [
  "Fast Pool open (past)",
  "Fast Pool extending (past)",
  "Fast Pool closed (past)",
];
const labelsNew = ["Fast Pool open", "Fast Pool extending", "Fast Pool closed"];
const colorsPast: string[] = ["#ddd", "#ddd", "#ddd"];
const colorsNew: string[] = ["#89F347", "#D0F858", "#A70A06"];

export const PoxChart = ({ currentHeight }: { currentHeight: number }) => {
  onMount(() => {
    Chart.register(Tooltip, Legend, Colors);
  });

  const { data, index } = dataWithCurrentHeight(currentHeight);
  const labels = labelsWithCurrentHightAt(index);
  const backgroundColor = colorsWithCurrentHightAt(index);

  console.log({ currentHeight, data, index, labels, backgroundColor });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  };
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
      },
      /* {
            data: [0, 0, 0, 432, 2100 - 432 - 300, 300],
            backgroundColor: [
              "#000",
              "#000",
              "#000",
              "#EB6500",
              "#89F347",
              "#A70A06",
            ],
          },
          */
    ],
  };
  return (
    <div class="w-2/4">
      <Doughnut
        data={chartData}
        options={chartOptions}
        width={100}
        height={100}
      />
    </div>
  );
};

const dataWithCurrentHeight = (currentHeight: number) => {
  const index = dataSum.findIndex((value) => value >= currentHeight);
  console.log({ index });
  const data = dataDefault.slice(0, index);
  data.push(dataDefault[index] + currentHeight - dataSum[index]);
  data.push(dataSum[index] - currentHeight);
  return { data: data.concat(dataDefault.slice(index + 1)), index };
};

const labelsWithCurrentHightAt = (index: number) => {
  let labels = labelsPast.slice(0, index + 1);
  return labels.concat(labelsNew.slice(index));
};
const colorsWithCurrentHightAt = (index: number) => {
  let colors = colorsPast.slice(0, index + 1);
  colors.push(colorsNew[index]);
  console.log({ colors });
  return colors.concat(colorsNew.slice(index + 1));
};
