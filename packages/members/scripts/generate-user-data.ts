import * as fs from 'fs';
// read all files in folder ../members
// and parse json
function readFiles() {
  console.log(import.meta.url);
  const inputDirCycles = __dirname + '/../../../packages/home/data/cycles/';
  const outputDirUsers = __dirname + '/../../../packages/home/data/users/';
  const outputDirContent = __dirname + '/../../../packages/home/content/users/';
  const outputRanking = __dirname + '/../../../packages/home/data/ranking.json';
  const outputCycles = __dirname + '/../../../packages/home/data/cycles.json';
  const outputComments = __dirname + '/../../../packages/home/data/comments.json';

  const hackers = fs.readFileSync(__dirname + '/../hackers.json').toString();
  const hackersData = JSON.parse(hackers).data as string[];
  //const hackersData = [];

  console.log('processing cycle data');
  console.log('hackers', hackersData.length);

  const ranking: {
    [key: string]: {
      stacker: string;
      count: number;
      min: string;
      max: string;
      maxAmount: number;
      totalRewards: number;
      sortKey: string;
    };
  } = {};
  const cycles: { [key: number]: { count: number; total: number; payout?: number } } = {};
  const comments: { [key: number]: { comment: string } } = {};

  fs.readdirSync(inputDirCycles).forEach(function (filename) {
    const cycleData = JSON.parse(fs.readFileSync(inputDirCycles + filename, 'utf-8'));
    const cycleId = parseInt(cycleData.cycle); // can be like 100 or 100.1 (mp/v2)
    if (cycleData.members === undefined) {
      console.log(cycleData.cycle, 'No members', filename);
      if (cycleData.comment) {
        comments[cycleId] = { comment: cycleData.comment };
      }
      return;
    }

    for (let stackerDetails of cycleData.members) {
      const stackerFilename = `${outputDirUsers}${stackerDetails.stacker}.json`;

      // read userData from file
      const content = fs.existsSync(stackerFilename)
        ? fs.readFileSync(stackerFilename).toString()
        : undefined;
      const userData = JSON.parse(content ? content : '{"cycles":{}}');
      if (userData.cycles === undefined) userData.cycles = {};

      const rewards = cycleData.payout
        ? Math.floor((cycleData.payout * (stackerDetails.amount || 0)) / (cycleData.total || 1))
        : undefined;
      userData.cycles[cycleId] = { cycle: cycleData.cycle, rewards, ...stackerDetails };
      userData.stacker = stackerDetails.stacker;

      const { maxAmount, totalRewards } = Object.keys(userData.cycles).reduce(
        (summary, cycle) => {
          return {
            maxAmount: Math.max(summary.maxAmount, userData.cycles[cycle].amount || 0),
            totalRewards: summary.totalRewards + (userData.cycles[cycle].rewards || 0),
          };
        },
        { maxAmount: 0, totalRewards: 0 }
      );
      userData.totalRewards = totalRewards;
      fs.writeFileSync(stackerFilename, JSON.stringify(userData));

      const cycleIds = Object.keys(userData.cycles);
      ranking[stackerDetails.stacker] = {
        stacker: stackerDetails.stacker,
        count: cycleIds.length,
        min: cycleIds[0],
        max: cycleIds[cycleIds.length - 1],
        maxAmount,
        totalRewards,
        sortKey:
          cycleIds.length.toString().padStart(4) +
          (9999 - parseInt(cycleIds[0])).toString().padStart(4) +
          cycleIds[cycleIds.length - 1].toString().padStart(4) +
          stackerDetails.stacker,
        // maxAmount.toString().padStart(24) + stackerDetails.stacker,
      };
    }
    if (cycles[cycleId]) {
      cycles[cycleId] = {
        count: cycles[cycleId].count + cycleData.count,
        total: cycles[cycleId].total + cycleData.total,
        payout: cycles[cycleId].payout + cycleData.payout,
      };
    } else {
      cycles[cycleId] = {
        count: cycleData.count,
        total: cycleData.total,
        payout: cycleData.payout,
      };
    }
  });

  fs.writeFileSync(`${outputRanking}`, JSON.stringify(ranking));
  fs.writeFileSync(`${outputCycles}`, JSON.stringify(cycles));
  fs.writeFileSync(`${outputComments}`, JSON.stringify(comments));

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
