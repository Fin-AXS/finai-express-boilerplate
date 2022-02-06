const httpStatus = require('http-status');
const Joi = require('joi');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const {value, err} = Joi.compile(validSchema)
      .prefs({errors: {label: 'key'}, abortEarly: false})
      .validate(object);
  if (err) {
    const errMsg = err.details.map((detail) => detail.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errMsg));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
