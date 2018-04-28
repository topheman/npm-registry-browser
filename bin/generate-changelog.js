#!/usr/bin/env node

/**
 * Simple util based on npm package generate-changelog
 *
 * Usage: ./generate-changelog.js previousTag currentTag
 */

const program = require("commander");
const packageJson = require("../package.json");
const githubUrlFromGit = require("github-url-from-git");
const generateChangelog = require("generate-changelog");
const { exec } = require("child_process");

const githubRepoUrl =
  (packageJson.repository &&
    packageJson.repository.url &&
    githubUrlFromGit(packageJson.repository.url)) ||
  undefined;

/**
 * generate-changelog always takes the latest tag as title / date
 * this patches this little bug and retrieves the exact date of the targetted tag
 */
const retrieveGitTagDate = tag =>
  new Promise((res, rej) => {
    exec(`git show -s --format=%ci ${tag}^{commit}`, (error, stdout) => {
      if (error) {
        return rej(error);
      }
      return res(stdout);
    });
  });

program
  .usage("<previousTag> <currentTag>")
  .command("* <previousTag> <currentTag>")
  .action((previousTag, currentTag) => {
    const githubDiffLink = `Diff: ${githubRepoUrl}/compare/${previousTag}...${currentTag}`;

    Promise.all([
      generateChangelog.generate({
        tag: `${previousTag}...${currentTag}`,
        repoUrl: githubRepoUrl
      }),
      retrieveGitTagDate(currentTag)
    ]).then(([changelog, currentTagDate]) => {
      console.log(
        changelog.replace(
          /^(.*)$/m,
          `#### ${currentTag} (${currentTagDate.substr(0, 10)})`
        ) + githubDiffLink
      );
    });
  });

program.parse(process.argv);
