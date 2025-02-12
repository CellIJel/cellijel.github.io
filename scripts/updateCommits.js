const fs = require('fs');
const path = require('path');
const { Octokit } = require("@octokit/rest");

const repoOwner = 'CellIJel';
const repoName = 'cellijel.github.io';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function getRecentCommits() {
  const { data: commits } = await octokit.repos.listCommits({
    owner: repoOwner,
    repo: repoName,
    per_page: 5,
  });

  return commits.map(commit => ({
    message: commit.commit.message,
    url: commit.html_url,
    date: commit.commit.author.date,
  }));
}

async function updateHTML(commits) {
  const filePath = path.join(__dirname, '../index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  const commitsHTML = commits.map(commit => `<li><a href="${commit.url}">${commit.message}</a> - ${new Date(commit.date).toLocaleString()}</li>`).join('');

  const updatedHTML = html.replace(
    /<!-- START RECENT COMMITS -->[\s\S]*<!-- END RECENT COMMITS -->/,
    `<!-- START RECENT COMMITS --><ul>${commitsHTML}</ul><!-- END RECENT COMMITS -->`
  );

  fs.writeFileSync(filePath, updatedHTML);
}

async function main() {
  const commits = await getRecentCommits();
  await updateHTML(commits);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});