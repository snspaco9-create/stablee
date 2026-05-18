const supabase = require('../supabase')
const { sendSMS } = require('../services/sms')

function buildReminderMessage(tenantName, amount, dueDate, propertyName, unitNumber) {
  return `Hello ${tenantName}, your rent of ₦${Number(amount).toLocaleString()} for ${propertyName} - ${unitNumber} is due on ${dueDate}. Please pay on time. - Stablee`
}

exports.sendReminder = async (req, res) => {
  const { tenant_id } = req.body

  if (!tenant_id) return res.status(400).json({ error: 'tenant_id is required' })

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*, units(unit_number, rent_amount, properties(name))')
    .eq('id', tenant_id)
    .single()

  if (error || !tenant) return res.status(404).json({ error: 'Tenant not found' })

  const message = buildReminderMessage(
    tenant.full_name,
    tenant.units.rent_amount,
    tenant.next_due_date,
    tenant.units.properties.name,
    tenant.units.unit_number
  )

  const result = await sendSMS(tenant.phone, message)

  await supabase.from('reminders').insert([{
    tenant_id,
    channel: 'sms',
    status: result.success ? 'sent' : 'failed',
    sent_at: new Date().toISOString(),
    message_id: result.data?.message_id || null
  }])

  if (!result.success) {
    return res.status(500).json({ error: 'Failed to send SMS', details: result.error })
  }

  res.json({ message: 'Reminder sent successfully', tenant: tenant.full_name })
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
    .select('*, units!inner(unit_number, rent_amount, properties!inner(name, landlord_id))')
    .eq('units.properties.landlord_id', landlord_id)
    .gte('next_due_date', todayStr)
    .lte('next_due_date', targetDateStr)

  if (error) return res.status(500).json({ error: error.message })

  if (!tenants || tenants.length === 0) {
    return res.json({ message: 'No tenants due in this period', sent: 0 })
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

    await supabase.from('reminders').insert([{
      tenant_id: tenant.id,
      channel: 'sms',
      status: result.success ? 'sent' : 'failed',
      sent_at: new Date().toISOString(),
      message_id: result.data?.message_id || null
    }])

    results.push({ tenant: tenant.full_name, success: result.success })
  }

  res.json({
    message: `Processed ${results.length} reminders`,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  })
}

exports.getReminderLogs = async (req, res) => {
  const { data, error } = await supabase
    .from('reminders')
    .select('*, tenants(full_name, phone)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}