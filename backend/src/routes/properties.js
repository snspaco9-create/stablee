const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertiesController')

router.get('/', auth, getProperties)
router.post('/', auth, createProperty)
router.put('/:id', auth, updateProperty)
router.delete('/:id', auth, deleteProperty)

module.exports = router