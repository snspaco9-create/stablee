const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getPayments,
  createPayment,
  getDashboardSummary
} = require('../controllers/paymentsController')

router.get('/summary', auth, getDashboardSummary)
router.get('/', auth, getPayments)
router.post('/', auth, createPayment)

module.exports = router