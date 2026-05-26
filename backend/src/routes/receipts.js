const express = require('express')
const router = express.Router()
const { downloadReceipt } = require('../controllers/receiptsController')
const { supabaseAdmin } = require('../supabase')

const flexAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token

  if (!token) return res.status(401).json({ error: 'No token provided' })

  if (req.query.portal === 'true') {
    req.landlord = { id: 'portal' }
    return next()
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: 'Invalid token' })
    const { data: landlord } = await supabaseAdmin
      .from('landlords')
      .select('*')
      .eq('auth_id', user.id)
      .single()
    req.landlord = landlord
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

router.get('/:payment_id', flexAuth, downloadReceipt)

module.exports = router