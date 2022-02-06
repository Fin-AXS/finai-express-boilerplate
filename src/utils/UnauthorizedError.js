/**
 * @module UnauthorizedError
 */
class UnauthorizedError extends Error {
  /**
   * Creates a new instance of UnauthorizedError
   * @param {Number} code status code representing the error
   * @param {String} message message describing the error
   */
  constructor(code = 401, message = 'Unauthorized') {
    super(message);
    this.statusCode = code;
  }

  /**
   * return a response friendly JSON of this error
   * @return {String}
   */
  toString() {
    return JSON.stringify({
      code: this.code,
      message: this.message
    }, null, 2);
  }
}

module.exports = UnauthorizedError;
