const express = require('express')
const router = express.Router()
const { downloadReceipt } = require('../controllers/receiptsController')
const { supabaseAdmin } = require('../supabase')

const flexAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const jwtToken = (authHeader && authHeader.split(' ')[1]) || req.query.token
  const portalToken = req.query.portal_token

  if (portalToken) {
    const { data: tenant, error } = await supabaseAdmin
      .from('tenants')
      .select('id, portal_token, portal_token_expires_at')
      .eq('portal_token', portalToken)
      .single()

    if (error || !tenant) return res.status(401).json({ error: 'Invalid portal token' })

    if (tenant.portal_token_expires_at && new Date(tenant.portal_token_expires_at) < new Date()) {
      return res.status(401).json({ error: 'Portal link has expired' })
    }

    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('tenant_id')
      .eq('id', req.params.payment_id)
      .single()

    if (!payment || payment.tenant_id !== tenant.id) {
      return res.status(403).json({ error: 'Access denied to this receipt' })
    }

    req.landlord = { id: 'portal', tenant_id: tenant.id }
    return next()
  }

  if (!jwtToken) return res.status(401).json({ error: 'No token provided' })

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(jwtToken)
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