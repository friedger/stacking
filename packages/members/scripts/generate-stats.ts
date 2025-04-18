import * as fs from 'fs';
// read all files in folder ../members
// and parse json
function readFiles() {
  console.log(import.meta.url);
  const inputDirCycles = __dirname + '/../../../packages/home/data/cycles/';
  const outputStats = __dirname + '/../../../packages/home/data/stats.json';
  console.log('read');
  const stats = { payout: 0, payoutFriedgerPool: 0, payoutFastPool: 0 };
  fs.readdirSync(inputDirCycles).forEach(function (filename) {
    try {
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
    } catch (e) {
      console.log('error', filename, e);
    }
  });

  fs.writeFileSync(`${outputStats}`, JSON.stringify(stats));
}

readFiles();
