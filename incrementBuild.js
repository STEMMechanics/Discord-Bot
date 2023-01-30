#!/usr/bin/env node
const fs = require("fs")
const { spawnSync } = require("child_process")

const buildData = fs.readFileSync('build.json');
let buildJson = {}
try {
    buildJson = JSON.parse(buildData);
} catch (error) {
    throw Error('There has been an error parsing the build JSON.')
}

if(isNaN(Number(buildJson.buildNumber))) {
    buildJson.buildNumber = 0
}

buildJson.buildNumber = String(Number(buildJson.buildNumber) + 1)

fs.writeFile('build.json', Buffer.from(JSON.stringify(buildJson, null, 2)), { encoding: "utf8" }, (error) => {
    if (error) {
        throw Error('There has been an error saving the store data.')
    }

    spawnSync("git", ["add", "build.json"])
    spawnSync("git", ["commit", `-m 'Updated build number'`])
});
