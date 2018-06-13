require('../config');

const debug = require('debuggler')();
const Env = require('../config/env');
const logger = require('../config/logger');
const mongoose = require('../config/mongoose');
const changelog = require('involves-changelog');
const Log = require('./log.model');

const resolveProperty = (labels, property) => {
  const label = labels.find(label =>
    label.startsWith(property) && label.indexOf(':') !== -1);

  if (!label) return null;

  return label.split(':')[1];
};

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

    log.motive = resolveProperty(log.issue.labels, 'motivo');
    log.priority = resolveProperty(log.issue.labels, 'prioridade');
    log.quality = resolveProperty(log.issue.labels, 'qualidade');
    log.team = resolveProperty(log.issue.labels, 'time');
    log.squad = resolveProperty(log.issue.labels, 'equipe');

    const oldLog = await Log.findOne({ 'issue.id': log.issue.id }).exec();
    if (oldLog) return Object.assign(oldLog, log).save();
    return new Log(log).save();
  }));
};

module.exports = store;
