const redis = require('redis');
const config = require('config');

const logger = require('./logger').getLogger('redis.cache.middleware');

/**
 * @type {import('redis').RedisClientType}
 */
const {url, username, password} = config.get('redis');

const RedisCacheClient = redis.createClient({
  url: `redis://${username}:${password}@${url}`
});
const configureRedisClient = async () => {
  try {
    await RedisCacheClient.connect();
    logger.info(`Connected to Redis Server at "redis://${username}:${password}@${url}"`);
  } catch (error) {
    logger.error(error);
    logger.info(`Could not connect to Redis Server at "redis://${username}:${password}@${url}"`);
  }
};

module.exports = {RedisCacheClient, configureRedisClient};
