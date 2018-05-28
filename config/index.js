const Env = require('./env');

const debug = require('debuggler')();

debug('initializing app configuration');

const Promise = require('./promise');

module.exports = {
  Promise,
  Env,
};
