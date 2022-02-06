const log4js = require('log4js');
const config = require('config');
const {resolve, join} = require('path');

const loggerConfig = config.get('logger');

let logFilePath = resolve(join(loggerConfig.directory, loggerConfig.filename));
if (!logFilePath) {
  logFilePath = join(process.cwd(), 'logs', 'app.log');
}

const logPattern = `%d{yyyy-MM-dd:hh.mm.ss.SSS} [%p] %c %f{1}@(%l,%o) : %m`;

log4js.configure({
  appenders: {
    app: {
      type: 'file',
      filename: logFilePath,
      maxLogSize: loggerConfig.maxLogSize || 1073741824,
      backups: loggerConfig.backups || 5,
      layout: {
        type: 'pattern',
        pattern: logPattern
      }
    }
  },
  categories: {
    default: {appenders: ['app'], level: loggerConfig.level, enableCallStack: true}
  }
});

module.exports = log4js;
