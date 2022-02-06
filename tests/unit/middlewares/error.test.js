const {assert} = require('chai');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');

const {errorConverter} = require('../../../src/middleware/error');
const ApiError = require('../../../src/utils/ApiError');

afterEach(() => {
  sinon.restore();
});

describe(`Error Middlware Unit Tests`, function() {
  describe(`Error Converter`, function() {
    it(`Should return the same ApiError object as it was called with`, function() {
      const error = new ApiError(httpStatus.BAD_REQUEST, 'Any Error');
      const nextFunFake = sinon.fake();
      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), nextFunFake);
      assert.isTrue(nextFunFake.calledOnceWith(error));
    });
    it(`Should convert any generic error to ApiError and preserve its status and message`,
        function() {
          const genericError = new Error('any error');
          genericError.statusCode = httpStatus.BAD_REQUEST;
          const nextFunFake = sinon.fake();
          errorConverter(genericError,
              httpMocks.createRequest,
              httpMocks.createRequest,
              nextFunFake
          );
          assert.isTrue(nextFunFake.firstCall.firstArg instanceof ApiError);
          assert.isTrue(nextFunFake.firstCall.firstArg.statusCode === genericError.statusCode);
          assert.isTrue(nextFunFake.firstCall.firstArg.message === genericError.message);
          assert.isTrue(nextFunFake.firstCall.firstArg.isOperational === false);
        });
  });
});
