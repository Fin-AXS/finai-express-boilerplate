const httpStatus = require('http-status');
const swaggerJsDoc = require('swagger-jsdoc');

const {openApiOptions} = require('../openapi');
const catchAsync = require('../utils/catchAsync');

const generateOpenApiSpecs = catchAsync((req, res) => {
  const openApiSpecs = swaggerJsDoc(openApiOptions);
  if (!openApiSpecs) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: httpStatus['500_MESSAGE']});
  }
  return res.status(200).json(openApiSpecs);
});

module.exports = {
  generateOpenApiSpecs
};
