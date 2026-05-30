const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  updateProfile,
  updateReminderPreferences,
  getProfile
} = require('../controllers/landlordsController')

router.get('/profile', auth, getProfile)
router.put('/profile', auth, updateProfile)
router.put('/reminder-preferences', auth, updateReminderPreferences)

module.exports = router