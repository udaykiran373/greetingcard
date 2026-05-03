const express = require('express');
const router = express.Router();
const { getPlans, activateSubscription, getStatus } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/plans', getPlans);
router.post('/activate', protect, activateSubscription);
router.get('/status', protect, getStatus);

module.exports = router;
