require('../config');

const debug = require('debuggler')();
const Env = require('../config/env');
const logger = require('../config/logger');
const octokit = require('@octokit/rest')();

octokit.authenticate({
  type: 'token',
  token: Env.GITHUB_TOKEN,
});

const getAllIssues = async (owner, repo, labels = []) => {
  debug(`retrieving issues for: "${owner}:${repo}", with labels: "${labels.join(', ')}"`);
  const issues = [];

  let response = await octokit.issues.getForRepo({
    owner,
    repo,
    labels,
    state: 'closed',
  });

  issues.push(...response.data);

  while (octokit.hasNextPage(response)) {
    debug(`retrieving next page for: "${owner}:${repo}", with labels: "${labels.join(', ')}"`);

    response = await octokit.getNextPage(response);
    issues.push(...response.data);
  }

  return issues;
};

const getTagValue = (content, tagName) => {
  const tagRegex = new RegExp(`<${tagName}>([^]*?)</${tagName}>`, 'g');

  return (content.match(tagRegex) || [])
    .map(tag => tag
      .replace(`<${tagName}>`, '')
      .replace(`</${tagName}>`, '')
      .trim());
};

const getInfo = (issue) => {
  const module = (issue.title).startsWith('//')
    ? issue.title.replace('//', '').split('-')[0].trim()
    : 'UNDEFINED';

  const description = (getTagValue(issue.title, 'GC-DESCRICAO')
    .pop() || '');

  const notes = getTagValue(issue.body, 'GC-NOTA')
    .map(note => ({
      melhorias: getTagValue(note, 'MELHORIA'),
      inovacoes: getTagValue(note, 'INOVACAO'),
      duvidas: getTagValue(note, 'DUVIDA'),
      correcoes: getTagValue(note, 'CORRECAO'),
      dataRelease: getTagValue(note, 'DATA_RELEASE').pop(),
    }));

  const cause = (getTagValue(issue.body, 'GC-CAUSA')
    .pop() || '')
    .split('\n')
    .filter(cause => cause
      .startsWith('- [x] -'))
    .map(cause => cause
      .replace('- [x] -', '')
      .trim())
    .pop();

  return {
    module,
    description,
    notes,
    cause,
  };
};

const changelog = async () => {
  debug('starting changelog analysis');

  const {
    GITHUB_COMPANY,
    GITHUB_PROJECT,
    ISSUE_LABELS,
  } = Env;

  const issues = await getAllIssues(GITHUB_COMPANY, GITHUB_PROJECT, ISSUE_LABELS.split(','));

  const info = issues.map(getInfo);

  console.log(info);
};

changelog()
  .then(() => {
    logger.info('Done!');
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
