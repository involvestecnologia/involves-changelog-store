require('../config');

const debug = require('debuggler')();
const Env = require('../config/env');
const logger = require('../config/logger');
const mongoose = require('../config/mongoose');
const changelog = require('involves-changelog');
const Log = require('./log.model');

const store = async (config) => {
  config = Object.assign({
    mongourl: Env.MONGO_URL,
  }, config);

  logger.info('Connecting to the database...');
  await mongoose(config.mongourl);

  logger.info('Retrieving changelog...');
  const logs = await changelog(config);
  debug('changelogs retrieved', (logs || []).length);

  logger.info('Storing changelog...');

  await Promise.all(logs.map(async (log) => {
    debug('saving changelog for issue', log.issue.id);

    log.created_at = new Date(log.created_at);
    log.updated_at = new Date(log.updated_at);

    const oldLog = await Log.findOne({ 'issue.id': log.issue.id }).exec();
    if (oldLog) return Object.assign(oldLog, log).save();
    return new Log(log).save();
  }));
};

module.exports = store;
