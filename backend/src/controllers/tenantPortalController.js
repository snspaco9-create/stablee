const { supabaseAdmin: supabase } = require('../supabase')
const { sendSMS } = require('../services/sms')
const crypto = require('crypto')

exports.generatePortalLink = async (req, res) => {
  const { tenant_id } = req.params

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*, units(unit_number, rent_amount, payment_cycle, properties(name))')
    .eq('id', tenant_id)
    .single()

  if (error || !tenant) return res.status(404).json({ error: 'Tenant not found' })

  const token = crypto.randomBytes(32).toString('hex')
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  await supabase
    .from('tenants')
    .update({ portal_token: token, portal_token_expires_at: expires_at })
    .eq('id', tenant_id)

  const portalUrl = `https://stablee.vercel.app/tenant/${token}`
  const message = `Hello ${tenant.full_name}, view your rent history and receipts here: ${portalUrl} (valid for 7 days) - StableeApp`

  const result = await sendSMS(tenant.phone, message)

  res.json({
    portal_url: portalUrl,
    sms_sent: result.success,
    tenant: tenant.full_name
  })
}

exports.getPortalData = async (req, res) => {
  const { token } = req.params

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*, units(unit_number, rent_amount, payment_cycle, properties(name, address, city))')
    .eq('portal_token', token)
    .single()

  if (error || !tenant) return res.status(404).json({ error: 'Invalid or expired portal link' })

  if (tenant.portal_token_expires_at && new Date(tenant.portal_token_expires_at) < new Date()) {
    return res.status(401).json({ error: 'This portal link has expired. Ask your landlord for a new one.' })
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('payment_date', { ascending: false })

  res.json({
    tenant: {
      full_name: tenant.full_name,
      phone: tenant.phone,
      unit: tenant.units.unit_number,
      property: tenant.units.properties.name,
      address: `${tenant.units.properties.address}, ${tenant.units.properties.city}`,
      rent_amount: tenant.units.rent_amount,
      payment_cycle: tenant.units.payment_cycle,
      next_due_date: tenant.next_due_date,
      lease_start: tenant.lease_start,
      lease_end: tenant.lease_end
    },
    payments: payments || []
  })
}