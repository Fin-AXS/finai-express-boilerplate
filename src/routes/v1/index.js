const express = require('express');

const healthRoutes = require('./health.route');
const oasRoutes = require('./oas.route');
const devRoutes = require('./dev.route');
const jwtAuthMiddleware = require('../../middleware/jwt-auth');

const router = express.Router();

/**
 * @module Route
 */
class Route {
  /**
   * Creates a new instance of Route
   * @param {Srting} path path of the route
   * @param {express.Router} router express router instance object
   * @param {Boolean} auth is authenticated route
   */
  constructor(path, router, auth) {
    this.path = path;
    this.router = router;
    this.auth = auth;
  };
  /**
   * returns a JSON represnetation of the route
   * @return {String}
   */
  toString() {
    return JSON.stringify({
      path: this.path,
      router: this.router.name,
      auth: this.auth
    });
  };
  /**
   * returns an object containing router component
   * @return {Object}
   */
  getRoute() {
    return {
      path: this.path,
      router: this.router,
      auth: this.auth
    };
  };
};

const defaultRoutes = [
  new Route('/health', healthRoutes, false).getRoute(),
  new Route('/oas', oasRoutes, false).getRoute(),
  new Route('/dev', devRoutes, true).getRoute()
  // Add new routes in this array.
];

defaultRoutes.forEach((route) => {
  if (route.auth) {
    router.use(route.path, jwtAuthMiddleware(), route.router);
  } else {
    router.use(route.path, route.router);
  }
});

module.exports = router;
