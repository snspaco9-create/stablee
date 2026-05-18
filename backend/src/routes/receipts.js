const express = require('express')
const router = express.Router()
const { downloadReceipt } = require('../controllers/receiptsController')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const flexAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    req.landlord = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

router.get('/:payment_id', flexAuth, downloadReceipt)

module.exports = router