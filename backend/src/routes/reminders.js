const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const remindersController = require('../controllers/remindersController')

router.post('/send', auth, remindersController.sendReminder)
router.post('/send-bulk', auth, remindersController.sendBulkReminders)
router.get('/logs', auth, remindersController.getReminderLogs)

module.exports = router