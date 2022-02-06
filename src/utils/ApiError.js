/**
 * @module ApiError
 */
class ApiError extends Error {
  /**
   * Creates a new instance of ApiError
   * @param {Number} statusCode Http status codes to represent error
   * @param {String} message Error message
   * @param {Boolean} isOperational isOperational
   * @param {Object} stack Error stack
   */
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
