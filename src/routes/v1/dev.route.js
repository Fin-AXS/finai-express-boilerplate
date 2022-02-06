const express = require('express');
const {devController} = require('../../controller');
const router = express.Router();

router.all('/methods', devController.testAllMethods);
router.get('/cache', devController.testCache);
module.exports = router;
