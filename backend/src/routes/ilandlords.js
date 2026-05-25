const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { updateProfile } = require('../controllers/landlordsController')

router.put('/profile', auth, updateProfile)

module.exports = router