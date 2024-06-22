import fs from 'node:fs';

const bucketUrls = [
  // fastpool
  'https://gaia.hiro.so/hub/1LAJYD2RQd4w9D6wZ3EQUVA6XYQvKC4WUH/',
  // friedgerpool
  'https://gaia.hiro.so/hub/1Er65eHyTN564atwxZP5TMghg5WjijXbv2/',
];

const loadUrl = async (bucketUrl: string, name: string, forceRefetch: boolean = false) => {
  let content;
  const filename = `.cache/${name}`;
  if (!fs.existsSync('.cache')) {
    fs.mkdirSync('.cache');
  }
  try {
    if (forceRefetch) {
      throw new Error('Force refetch');
    }
    content = fs.readFileSync(filename).toString();
    console.log(content);
  } catch (e) {
    console.log(e);
    try {
      const contentResponse = await fetch(`${bucketUrl}${name}`);
      content = await contentResponse.text();
      console.log(content);
      fs.writeFileSync(filename, content);
    } catch (e) {
      console.log(e);
      content = {};
    }
  }
  return content;
};
const titleToFilename = (title: string) => {
  const pos = title.indexOf('#');
  return title.substring(pos + 1, pos + 3);
};
const download = async (bucketUrl: string) => {
  const blogString = await loadUrl(bucketUrl, 'publicStories.json', true);
  const blogData = JSON.parse(blogString);
  for (let story of blogData.stories) {
    console.log('id', story.id);
    const storyString = await loadUrl(bucketUrl, `${story.id}.json`);
    const storyData = JSON.parse(storyString);
    fs.writeFileSync(
      `${titleToFilename(storyData.title)}.html`,
      `---
weight: 1
title: "${storyData.title}"
description: "${storyData.title}"
nav_heading: "Rewards"
case_feature_img: "${storyData.coverImage}"
case_summary: "Rewards"
layout: "rewards"
draft: false
---

${storyData.content}`
    );
  }
};

download(bucketUrls[0]).then(() => download(bucketUrls[1]));
