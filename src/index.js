require('../config');

const debug = require('debuggler')();
const Env = require('../config/env');
const logger = require('../config/logger');
const mongoose = require('../config/mongoose');
const changelog = require('involves-changelog');
const Issue = require('./issue.model');

const store = async (config) => {
  config = Object.assign({
    mongourl: Env.MONGO_URL,
  }, config);

  logger.info('Connecting to the database...');
  await mongoose(config.mongourl);

  logger.info('Retrieving changelog...');
  const issues = await changelog(config);
  debug('changelog retrieved', issues);

  logger.info('Storing changelog...');

  await Promise.all(issues.map(async (issue) => {
    const oldIssue = await Issue.findOne({ 'issue.id': issue.issue.id });
    if (oldIssue) {
      return Object.assign(oldIssue, issue).save();
    }
    return new Issue(issue).save();
  }));
};

module.exports = store;
