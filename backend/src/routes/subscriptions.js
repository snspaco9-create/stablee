const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  initializePayment,
  verifyPayment
} = require('../controllers/subscriptionsController')

router.post('/initialize', auth, initializePayment)
router.get('/verify', verifyPayment)

module.exports = router