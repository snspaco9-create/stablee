const { supabaseAdmin: supabase } = require('../supabase')
const { sendSMS } = require('../services/sms')

function buildReminderMessage(tenantName, amount, dueDate, propertyName, unitNumber) {
  return `Hello ${tenantName}, your rent of ₦${Number(amount).toLocaleString()} for ${propertyName} - ${unitNumber} is due on ${dueDate}. Please pay on time. - Stablee`
}

exports.sendReminder = async (req, res) => {
  const { tenant_id } = req.body
  const landlord_id = req.landlord.id

  if (!tenant_id) {
    return res.status(400).json({
      error: 'tenant_id is required'
    })
  }

  // Verify that this tenant belongs to the logged-in landlord
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select(`
      *,
      units!inner(
        unit_number,
        rent_amount,
        properties!inner(
          name,
          landlord_id
        )
      )
    `)
    .eq('id', tenant_id)
    .eq('units.properties.landlord_id', landlord_id)
    .single()

  if (error || !tenant) {
    return res.status(404).json({
      error: 'Tenant not found'
    })
  }

  const message = buildReminderMessage(
    tenant.full_name,
    tenant.units.rent_amount,
    tenant.next_due_date,
    tenant.units.properties.name,
    tenant.units.unit_number
  )

  const result = await sendSMS(tenant.phone, message)

  const { error: logError } = await supabase
    .from('reminders')
    .insert([{
      tenant_id,
      channel: 'sms',
      status: result.success ? 'sent' : 'failed',
      sent_at: new Date().toISOString(),
      message_id: result.data?.message_id || null
    }])

  if (logError) {
    console.error('Reminder log error:', logError)
  }

  if (!result.success) {
    return res.status(200).json({
      message: 'Reminder logged but SMS pending — sender ID approval in progress',
      tenant: tenant.full_name,
      pending: true
    })
  }

  res.json({
    message: 'Reminder sent successfully',
    tenant: tenant.full_name
  })
}

exports.sendBulkReminders = async (req, res) => {
  const landlord_id = req.landlord.id
  const daysAhead = req.body.days_ahead || 7

  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + daysAhead)

  const targetDateStr = targetDate.toISOString().split('T')[0]
  const todayStr = new Date().toISOString().split('T')[0]

  const { data: tenants, error } = await supabase
    .from('tenants')
    .select(`
      *,
      units!inner(
        unit_number,
        rent_amount,
        properties!inner(
          name,
          landlord_id
        )
      )
    `)
    .eq('units.properties.landlord_id', landlord_id)
    .gte('next_due_date', todayStr)
    .lte('next_due_date', targetDateStr)

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  if (!tenants || tenants.length === 0) {
    return res.json({
      message: 'No tenants due in this period',
      sent: 0
    })
  }

  const results = []

  for (const tenant of tenants) {
    const message = buildReminderMessage(
      tenant.full_name,
      tenant.units.rent_amount,
      tenant.next_due_date,
      tenant.units.properties.name,
      tenant.units.unit_number
    )

    const result = await sendSMS(tenant.phone, message)

    const { error: logError } = await supabase
      .from('reminders')
      .insert([{
        tenant_id: tenant.id,
        channel: 'sms',
        status: result.success ? 'sent' : 'failed',
        sent_at: new Date().toISOString(),
        message_id: result.data?.message_id || null
      }])

    if (logError) {
      console.error('Reminder log error:', logError)
    }

    results.push({
      tenant: tenant.full_name,
      success: result.success
    })
  }

  res.json({
    message: `Processed ${results.length} reminders`,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  })
}

exports.getReminderLogs = async (req, res) => {
  const landlord_id = req.landlord.id

  // First get only tenants belonging to this landlord
  const { data: tenants, error: tenantError } = await supabase
    .from('tenants')
    .select(`
      id,
      units!inner(
        properties!inner(
          landlord_id
        )
      )
    `)
    .eq('units.properties.landlord_id', landlord_id)

  if (tenantError) {
    return res.status(500).json({
      error: tenantError.message
    })
  }

  const tenantIds = (tenants || []).map(tenant => tenant.id)

  if (tenantIds.length === 0) {
    return res.json([])
  }

  // Only retrieve reminder logs belonging to this landlord's tenants
  const { data, error } = await supabase
    .from('reminders')
    .select('*, tenants(full_name, phone)')
    .in('tenant_id', tenantIds)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.json(data)
}