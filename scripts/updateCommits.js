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
  if (typeof document !== 'undefined') {
    const commitList = document.getElementById('commit-list');
    const commitsHTML = commits.map(commit => `
      <li>
        <div class="commit-message"><a href="${commit.url}">${commit.message}</a></div>
        <div class="commit-date">${new Date(commit.date).toLocaleString()}</div>
      </li>
    `).join('');
    commitList.insertAdjacentHTML('beforeend', commitsHTML);
  }
}

async function loadMoreCommits() {
  const commits = await getRecentCommits(currentPage);
  renderCommits(commits);
  currentPage++;

  if ((currentPage - 1) * commitsPerPage >= maxCommits) {
    if (typeof document !== 'undefined') {
      document.getElementById('load-more').style.display = 'none';
    }
  }
}

if (typeof document !== 'undefined') {
  document.getElementById('load-more').addEventListener('click', loadMoreCommits);
}

async function main() {
  const commits = await getRecentCommits();
  if (typeof document !== 'undefined') {
    renderCommits(commits);

    if (commits.length > 0) {
      document.getElementById('load-more').style.display = 'block';
    }
  } else {
    // For Node.js environment, update the HTML file directly
    updateHTML(commits);
  }
}

function updateHTML(commits) {
  const filePath = path.join(__dirname, '../index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  const commitsHTML = commits.map(commit => `
    <li>
      <div class="commit-message"><a href="${commit.url}">${commit.message}</a></div>
      <div class="commit-date">${new Date(commit.date).toLocaleString()}</div>
    </li>
  `).join('');

  const updatedHTML = html.replace(
    /<!-- START RECENT COMMITS -->[\s\S]*<!-- END RECENT COMMITS -->/,
    `<!-- START RECENT COMMITS --><ul class="commit-list">${commitsHTML}</ul><a id="load-more" class="load-more" href="javascript:void(0);">Load More</a><!-- END RECENT COMMITS -->`
  );

  fs.writeFileSync(filePath, updatedHTML);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
