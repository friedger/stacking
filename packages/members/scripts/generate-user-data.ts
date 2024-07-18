import * as fs from 'fs';
// read all files in folder ../members
// and parse json
function readFiles() {
  console.log(import.meta.url);
  const inputDirCycles = __dirname + '/../../../packages/home/data/cycles/';
  const outputDirUsers = __dirname + '/../../../packages/home/data/users/';
  const outputDirContent = __dirname + '/../../../packages/home/content/users/';
  const outputRanking = __dirname + '/../../../packages/home/data/ranking.json';
  const outputDropout = __dirname + '/../../../packages/home/data/dropout.json';

  console.log('read');
  const ranking = {};
  const dropOuts = {};
  fs.readdirSync(inputDirCycles).forEach(function (filename) {
    const cycleData = JSON.parse(fs.readFileSync(inputDirCycles + filename, 'utf-8'));
    if (cycleData.members === undefined) {
      console.log(cycleData.cycle, 'No members', filename);
      return;
    }
    const cycleId = parseInt(cycleData.cycle);

    for (let stackerDetails of cycleData.members) {
      const content = fs
        .readFileSync(`${outputDirUsers}${stackerDetails.stacker}.json`, { flag: 'as+' })
        .toString();
      const userData = JSON.parse(content ? content : '{"cycles":{}}');
      if (userData.cycles === undefined) userData.cycles = {};

      userData.cycles[cycleId] = { cycle: cycleData.cycle, ...stackerDetails };
      userData.stacker = stackerDetails.stacker;

      fs.writeFileSync(`${outputDirUsers}${stackerDetails.stacker}.json`, JSON.stringify(userData));

      const cycleIds = Object.keys(userData.cycles);
      ranking[stackerDetails.stacker] = {
        stacker: stackerDetails.stacker,
        count: cycleIds.length,
        min: cycleIds[0],
        max: cycleIds[cycleIds.length - 1],
        sortKey:
          cycleIds.length.toString().padStart(4) +
          (9999 - parseInt(cycleIds[0])).toString().padStart(4) +
          cycleIds[cycleIds.length - 1].toString().padStart(4) +
          stackerDetails.stacker,
      };
      if (cycleIds[cycleIds.length - 1] === '88') {
        dropOuts[stackerDetails.stacker] = {
          min: cycleIds[0],
          max: cycleIds[cycleIds.length - 1],
          amount: userData.cycles['88'].amount,
        };
      }
    }
  });

  fs.writeFileSync(`${outputRanking}`, JSON.stringify(ranking));
  fs.writeFileSync(`${outputDropout}`, JSON.stringify(dropOuts));

  for (let user of Object.keys(ranking)) {
    const userStat = ranking[user];
    console.log(`${user}, ${userStat.count}, ${userStat.min}, ${userStat.max}`);
    fs.writeFileSync(
      `${outputDirContent}${user}.md`,
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

readFiles();
