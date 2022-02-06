const express = require('express');

const {oasController} = require('../../controller');

const router = express.Router();

/**
 * @openapi
 * /oas:
 *   get:
 *     tags:
 *       - public
 *     summary: Get OpenAPI Specs
 *     description: Get OpenAPI Specs for this service
 *     responses:
 *       '200':
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 */
router.get('/', oasController.generateOpenApiSpecs);

module.exports = router;
