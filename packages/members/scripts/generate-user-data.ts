import * as fs from 'fs';
// read all files in folder ../members
// and parse json
function readFiles() {
  console.log(import.meta.url);
  const inputDirCycles = __dirname + '/../../../packages/home/data/cycles/';
  const outputDirUsers = __dirname + '/../../../packages/home/data/users/';
  const outputDirContent = __dirname + '/../../../packages/home/content/users/';
  const outputRanking = __dirname + '/../../../packages/home/data/ranking.json';

  const hackers = fs.readFileSync(__dirname + '/../hackers.json').toString();
  const hackersData = JSON.parse(hackers).data;
  //const hackersData = [];

  console.log('processing cycle data');
  console.log('hackers', hackersData.length);

  const ranking = {};
  fs.readdirSync(inputDirCycles).forEach(function (filename) {
    const cycleData = JSON.parse(fs.readFileSync(inputDirCycles + filename, 'utf-8'));
    if (cycleData.members === undefined) {
      console.log(cycleData.cycle, 'No members', filename);
      return;
    }
    const cycleId = parseInt(cycleData.cycle);

    for (let stackerDetails of cycleData.members) {
      const stackerFilename = `${outputDirUsers}${stackerDetails.stacker}.json`;
      const content = fs.readFileSync(stackerFilename, { flag: 'as+' }).toString();
      const userData = JSON.parse(content ? content : '{"cycles":{}}');
      if (userData.cycles === undefined) userData.cycles = {};

      userData.cycles[cycleId] = { cycle: cycleData.cycle, ...stackerDetails };
      userData.stacker = stackerDetails.stacker;
      const maxAmount = Object.keys(userData.cycles).reduce((max, cycle) => {
        return Math.max(max, userData.cycles[cycle].amount || 0);
      }, 0);
      fs.writeFileSync(stackerFilename, JSON.stringify(userData));

      const cycleIds = Object.keys(userData.cycles);
      ranking[stackerDetails.stacker] = {
        stacker: stackerDetails.stacker,
        count: cycleIds.length,
        min: cycleIds[0],
        max: cycleIds[cycleIds.length - 1],
        maxAmount,
        sortKey:
          // cycleIds.length.toString().padStart(4) +
          // (9999 - parseInt(cycleIds[0])).toString().padStart(4) +
          // cycleIds[cycleIds.length - 1].toString().padStart(4) +
          // stackerDetails.stacker,
          maxAmount.toString().padStart(24) + stackerDetails.stacker,
      };
    }
  });

  fs.writeFileSync(`${outputRanking}`, JSON.stringify(ranking));

  for (let user of Object.keys(ranking)) {
    const userStat = ranking[user];
    const isHackers = hackersData.find(h => h === user);
    if (isHackers) {
      console.log('***');
      console.log(`${user}, ${userStat.count}, ${userStat.min}, ${userStat.max}`);
      console.log('***');
    } else {
      //console.log(`${user}, ${userStat.count}, ${userStat.min}, ${userStat.max}`);
    }
    const userFilename = `${outputDirContent}${user}.md`;
    if (!fs.existsSync(userFilename)) {
      fs.writeFileSync(
        userFilename,
        `---
title: "${user}"
date: ${new Date().toISOString()}
user: ${user}
layout: "users"
---
    `
      );
    }
  }
}

readFiles();
