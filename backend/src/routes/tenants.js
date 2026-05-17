const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant
} = require('../controllers/tenantsController')

router.get('/', auth, getTenants)
router.post('/', auth, createTenant)
router.put('/:id', auth, updateTenant)
router.delete('/:id', auth, deleteTenant)

module.exports = router