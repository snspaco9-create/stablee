const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const {
  getOverview,
  getLandlords,
  updateLandlordPlan,
  getReminderLogs
} = require('../controllers/adminController')

router.get('/overview', auth, admin, getOverview)
router.get('/landlords', auth, admin, getLandlords)
router.put('/landlords/:id/plan', auth, admin, updateLandlordPlan)
router.get('/reminders', auth, admin, getReminderLogs)

module.exports = router