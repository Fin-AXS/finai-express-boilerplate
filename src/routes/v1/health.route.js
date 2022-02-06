const express = require('express');

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - public
 *     summary: Handler for various probes
 *     description: Handler for various probes
 *     responses:
 *       '200':
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: string
 */
router.get('/', (req, res) => {
  res.status(200).json({message: 'healthy'});
});

module.exports = router;
