const dataDefault = [1050, 850, 100, 100];
let sum = 0;
const dataSum = dataDefault.map((value) => {
  sum += value;
  return sum;
});

const labelsPassed = [
  "Fast Pool open (passed)",
  "Fast Pool extending (passed)",
  "Fast Pool closed (passed)",
  "Prepare phase (passed)",
];
const labelsNew = [
  "Fast Pool open",
  "Fast Pool extending",
  "Fast Pool closed",
  "Prepare phase",
];
const colorsPassed: string[] = ["#E9F2E3", "#FFF4D6", "#FFCFC2", "#FCD9E5"];
const colorsNew: string[] = ["#6DA34D", "#FFD25A", "#FF8360", "#4C061D"];

export const detailsFastPool = {
  dataDefault,
  dataSum,
  labelsNew,
  labelsPassed,
  colorsNew,
  colorsPassed,
};
