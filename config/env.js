const path = require('path');
const Changelog = require('involves-changelog/config/env');

/**
* @see https://github.com/motdotla/dotenv#usage
*/
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env.test') });
} if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env') });
}

/**
 * @class Env
 */
class Env extends Changelog {
  /**
   * @default 'mongodb://localhost:27017/involves-changelog'
   * @return {String}
   */
  static get MONGO_URL() {
    return process.env.MONGO_URL || 'mongodb://localhost:27017/involves-changelog';
  }
}

module.exports = Env;
