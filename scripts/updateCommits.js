const fs = require('fs');
const path = require('path');
const { Octokit } = require("@octokit/rest");

const repoOwner = 'CellIJel';
const repoName = 'cellijel.github.io';

const octokit = new Octokit({
  auth: process.env.COMMITS_TOKEN,
});

let currentPage = 1;
const commitsPerPage = 5;
const maxCommits = 15;

async function getRecentCommits(page = 1) {
  const { data: commits } = await octokit.repos.listCommits({
    owner: repoOwner,
    repo: repoName,
    per_page: commitsPerPage,
    page: page,
  });

  return commits.map(commit => ({
    message: commit.commit.message,
    url: commit.html_url,
    date: commit.commit.author.date,
  }));
}

function renderCommits(commits) {
  const commitList = document.getElementById('commit-list');
  const commitsHTML = commits.map(commit => `
    <li>
      <div class="commit-message"><a href="${commit.url}">${commit.message}</a></div>
      <div class="commit-date">${new Date(commit.date).toLocaleString()}</div>
    </li>
  `).join('');
  commitList.insertAdjacentHTML('beforeend', commitsHTML);
}

async function loadMoreCommits() {
  if ((currentPage - 1) * commitsPerPage + commitsPerPage >= maxCommits) {
    document.getElementById('load-more').style.display = 'none';
  }

  const commits = await getRecentCommits(currentPage);
  renderCommits(commits);
  currentPage++;
}

document.getElementById('load-more').addEventListener('click', loadMoreCommits);

async function main() {
  await loadMoreCommits();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
