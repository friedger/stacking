import { Chart, Colors, Legend, Tooltip } from "chart.js";
import { Doughnut } from "solid-chartjs";
import { onMount } from "solid-js";

export const PoxChart = ({
  currentHeight,
  details,
}: {
  currentHeight: number;
  details: {
    dataDefault: number[];
    dataSum: number[];
    labelsPassed: string[];
    labelsNew: string[];
    colorsPassed: string[];
    colorsNew: string[];
  };
}) => {
  onMount(() => {
    Chart.register(Tooltip, Legend, Colors);
  });

  const {
    dataDefault,
    dataSum,
    labelsPassed,
    labelsNew,
    colorsPassed,
    colorsNew,
  } = details;

  const dataWithCurrentHeight = (currentHeight: number) => {
    const index = dataSum.findIndex((value) => value >= currentHeight);
    const data = dataDefault.slice(0, index);
    data.push(dataDefault[index] + currentHeight - dataSum[index]);
    data.push(dataSum[index] - currentHeight);
    return { data: data.concat(dataDefault.slice(index + 1)), index };
  };

  const labelsWithCurrentHightAt = (index: number) => {
    let labels = labelsPassed.slice(0, index + 1);
    return labels.concat(labelsNew.slice(index));
  };
  const colorsWithCurrentHightAt = (index: number) => {
    let colors = colorsPassed.slice(0, index + 1);
    colors.push(colorsNew[index]);
    return colors.concat(colorsNew.slice(index + 1));
  };

  const { data, index } = dataWithCurrentHeight(currentHeight);
  const labels = labelsWithCurrentHightAt(index);
  const backgroundColor = colorsWithCurrentHightAt(index);

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
