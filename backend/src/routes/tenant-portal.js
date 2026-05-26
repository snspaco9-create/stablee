const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  generatePortalLink,
  getPortalData
} = require('../controllers/tenantPortalController')

router.post('/generate/:tenant_id', auth, generatePortalLink)
router.get('/:token', getPortalData)

module.exports = router