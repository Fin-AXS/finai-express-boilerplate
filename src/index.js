if (process.env.NODE_ENV === 'development') {
  try {
    require('dotenv').config();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
const config = require('config');
const {readFileSync} = require('fs');

const {configureRedisClient} = require('./middleware/cache');
const pkg = require('../package.json');
const logger = require('./middleware/logger').getLogger('index');

logger.info(readFileSync('./src/banner.txt', 'utf-8'));
logger.info(`${pkg.name} started in ${process.env.NODE_ENV} mode`);

configureRedisClient();
const server = require('./server').listen(config.get('server.port'), () => {
  logger.info(`${pkg.name} API server is running on port ${config.get('server.port')}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
module.exports = server;
