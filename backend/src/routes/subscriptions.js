const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  initializePayment,
  verifyPayment,
  paystackWebhook
} = require('../controllers/subscriptionsController')

router.post('/initialize', auth, initializePayment)
router.get('/verify', verifyPayment)
router.post('/webhook', express.raw({ type: 'application/json' }), paystackWebhook)

module.exports = router