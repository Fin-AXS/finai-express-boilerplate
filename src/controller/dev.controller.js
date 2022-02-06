const catchAsync = require('../utils/catchAsync');
const {RedisCacheClient} = require('../middleware/cache');

const testAllMethods = catchAsync((req, res) => {
  res.status(200).json({
    message: `Handling ${req.method} for dev routes`
  });
});

const testCache = catchAsync(async (req, res) => {
  RedisCacheClient.set('ping', 'pong');
  res.status(200).send(RedisCacheClient.get('ping'));
  RedisCacheClient.del('ping');
});

module.exports = {
  testAllMethods, testCache
};
