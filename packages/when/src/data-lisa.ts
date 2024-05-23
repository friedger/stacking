const dataDefault = [432, 2100 - 100 - 300 - 432, 300, 100];
let sum = 0;
const dataSum = dataDefault.map((value) => {
  sum += value;
  return sum;
});

const labelsPassed = [
  "Waiting for rewards (passed)",
  "Lisa open (passed)",
  "Lisa closed (passed)",
  "Prepare phase (passed)",
];
const labelsNew = [
  "Waiting for rewards",
  "Lisa open",
  "Lisa closed",
  "Prepare phase",
];
const colorsPassed: string[] = ["#FFF4D6", "#E9F2E3", "#FFCFC2", "#FCD9E5"];
const colorsNew: string[] = ["#FFD25A", "#6DA34D", "#FF8360", "#4C061D"];

export const detailsLisa = {
  dataDefault,
  dataSum,
  labelsNew,
  labelsPassed,
  colorsNew,
  colorsPassed,
};
