const config = require('config');

const package = require('../../package.json');

const openApiOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${package.name} Service APIs`,
      description: `APIs for interacting with ${package.name} as a microservice`,
      contact: {
        name: 'dkrypt@FinAI',
        url: 'github.com/Fin-AXS',
        email: 'deepak29km@gmail.com'
      }
    },
    servers: config.get('app.openapi.servers').split(',')
        .map((e) => e.trim())
        .map((url)=> {
          return {url};
        })
  },
  apis: ['./src/routes/v1/*.js']
};

module.exports = {
  openApiOptions
};
