const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/save-client', clientController.saveClient);
router.get('/orders', clientController.getOrders);

module.exports = router;
