import * as fs from 'fs';
// read all files in folder ../members
// and parse json
function readFiles() {
  console.log(import.meta.url);
  const inputDirCycles =
    '/home/friedger/_repos/github/friedger/stacking/packages/home/data/cycles/';
  const outputStats =
    '/home/friedger/_repos/github/friedger/stacking/packages/home/data/stats.json';
  console.log('read');
  const stats = { payout: 0, payoutFriedgerPool: 0, payoutFastPool: 0 };
  fs.readdirSync(inputDirCycles).forEach(function (filename) {
    const cycleData = JSON.parse(fs.readFileSync(inputDirCycles + filename, 'utf-8'));
    if (cycleData.payout === undefined) {
      console.log(cycleData.cycle, 'No payout', filename);
      return;
    }
    const cycleId = parseInt(cycleData.cycle);

    stats.payout += cycleData.payout;
    if (cycleId < 56) {
      stats.payoutFriedgerPool += cycleData.payout;
    } else {
      stats.payoutFastPool += cycleData.payout;
    }
  });

  fs.writeFileSync(`${outputStats}`, JSON.stringify(stats));
}

readFiles();
