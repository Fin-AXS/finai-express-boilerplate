const axios = require('axios').default;
const config = require('config');
const httpStatus = require('http-status');
const crypto = require('crypto');

const UnauthorizedError = require('../utils/UnauthorizedError');
const logger = require('./logger').getLogger('jwt.auth.middleware');
const {RedisCacheClient} = require('./cache');
/**
 * middleware that ensures Authorization header is present or not
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {Function} next express next function
 * @return {void}
 */
const ensureAuthorizationHeader = (req, res, next) => {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(httpStatus.BAD_REQUEST)
        .send(new UnauthorizedError(400, 'Bad request').toString());
  }
  const auth = req.headers.authorization.split(' ');
  if (auth.length === 1) {
    return res.status(httpStatus.UNAUTHORIZED)
        .send(new UnauthorizedError(401, 'Invalid auth in header').toString());
  }
  if (auth[0].trim() !== 'Bearer') {
    return res.status(httpStatus.UNAUTHORIZED)
        .send(new UnauthorizedError(401, 'Invalid prefix in JWT Auth').toString());
  }
  req.auth = auth[1];
  next();
};

const validateJwt = async (req, res, next) => {
  if (!req.auth) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(httpStatus['500_MESSAGE']);
  }
  const token = req.auth;
  const tokenHash = await isTokenCached(token);
  if (tokenHash === null) {
    try {
      const response = await verifyJwt(null, token);
      if (!response || response.status !== 200) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(httpStatus['500_MESSAGE']);
      }
      if (response.data.valid) {
        req.isAuthenticated = true;
        await cacheToken(token);
        next();
      }
    } catch (err) {
      if (err.response && err.response.status && err.response.data) {
        logger.error('Request unauthorized. Reason :', err.response.data.message);
        return res.status(400).json(err.response.data);
      } else {
        logger.error('Request unauthorized. Reason : UNKNOWN_ERROR');
        return res.status(500)
            .json({message: 'Something unknown happened during token introspection.'});
      }
    };
  } else {
    if (verifyJwt(tokenHash, token)) {
      next();
    } else {
      return res.status(httpStatus.UNAUTHORIZED).send(httpStatus['401_MESSAGE']);
    }
  }
};
const verifyJwt = async (hash, token) => {
  if (hash === null) {
    const response = await axios.post(
        config.get('app.auth.jwtIntrospectEndpoint'),
        `token=${token}`,
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          responseType: 'json'
        }
    );
    return response;
  } else {
    const tokenFromCache = await RedisCacheClient.get(hash);
    const tokenPayload = tokenFromCache.split('\.')[1];
    const decodedPayloadJson = Buffer.from(tokenPayload, 'base64').toString();
    const {exp} = JSON.parse(decodedPayloadJson);
    if ((parseInt(exp) * 1000) < Date.now()) {
      return false;
    } else {
      return true;
    }
  }
};
const cacheToken = async (token) => {
  const tokenHash = crypto.createHash('md5').update(token).digest('hex');
  try {
    await RedisCacheClient.set(tokenHash, token);
  } catch (error) {
    logger.error('Error occurred while caching token');
    logger.error(error);
  }
  return;
};
const isTokenCached = async (token) => {
  const tokenHash = crypto.createHash('md5').update(token).digest('hex');
  const isTokenCached = await RedisCacheClient.exists(tokenHash);
  return Boolean(isTokenCached) ? tokenHash : null;
};

const jwtAuthMiddleware = () => [ensureAuthorizationHeader, validateJwt];

module.exports = jwtAuthMiddleware;
