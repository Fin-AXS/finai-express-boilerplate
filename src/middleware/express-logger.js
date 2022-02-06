const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const config = require('config');
const {generateId} = require('../utils/generateId');

/**
 * Returns an express middleware for logging
 * HTTP transactions (request and response).
 * @return {morgan.Morgan}
 */
module.exports = () => {
  // logger config
  const loggerConfig = config.get('logger');
  // rotating file stream for rotating log files
  const accessLogStream = rfs.createStream('access.log', {
    path: loggerConfig.directory,
    compress: true,
    maxFiles: loggerConfig.backups,
    size: `${loggerConfig.maxLogSize}B`
  });
  // custom JSON format for log lines
  const format = {
    'date': ':date',
    'id': ':id',
    'http-version': ':http-version',
    'method': ':method',
    'remote-address': ':remote-addr',
    'remote-user': ':remote-user',
    'user-agent': ':user-agent',
    'url': ':url',
    'body': ':body',
    'total-time': ':total-time',
    'headers': {
      'Content-Type': 'req[content-type]'
    },
    'Response': {
      'status': ':status',
      'response-time': ':response-time',
      'headers': {
        'Content-Type': ':res[content-type]',
        'Content-Length': ':res[content-length]'
      }
    }
  };

  // custom morgan tokens
  morgan.token('body', (req) => JSON.stringify(req.body));
  morgan.token('id', () => generateId(20));
  // custom morgan format
  morgan.format('detail', JSON.stringify(format));

  return morgan('detail', {stream: accessLogStream});
};
