const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit
} = require('../controllers/unitsController')

router.get('/:property_id', auth, getUnits)
router.post('/', auth, createUnit)
router.put('/:id', auth, updateUnit)
router.delete('/:id', auth, deleteUnit)

module.exports = router