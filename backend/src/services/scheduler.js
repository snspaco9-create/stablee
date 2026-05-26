const cron = require('node-cron')
const { supabaseAdmin: supabase } = require('../supabase')
const { sendSMS } = require('./sms')

function buildReminderMessage(tenantName, amount, dueDate, propertyName, unitNumber, daysUntilDue) {
  const formattedAmount = `₦${Number(amount).toLocaleString()}`

  if (daysUntilDue === 30) {
    return `Hello ${tenantName}, this is a friendly reminder that your rent of ${formattedAmount} for ${propertyName} - ${unitNumber} is due on ${dueDate}. - StableeApp`
  }
  if (daysUntilDue === 14) {
    return `Hello ${tenantName}, your rent of ${formattedAmount} for ${propertyName} - ${unitNumber} is due in 2 weeks on ${dueDate}. Please start preparing. - StableeApp`
  }
  if (daysUntilDue === 7) {
    return `Hello ${tenantName}, your rent of ${formattedAmount} for ${propertyName} - ${unitNumber} is due in 7 days on ${dueDate}. Please prepare payment. - StableeApp`
  }
  if (daysUntilDue === 3) {
    return `Hello ${tenantName}, your rent of ${formattedAmount} for ${propertyName} - ${unitNumber} is due in 3 days on ${dueDate}. Kindly make payment promptly. - StableeApp`
  }
  if (daysUntilDue === 1) {
    return `Hello ${tenantName}, your rent of ${formattedAmount} for ${propertyName} - ${unitNumber} is due TOMORROW (${dueDate}). Please ensure payment is ready. - StableeApp`
  }
  if (daysUntilDue === 0) {
    return `Hello ${tenantName}, your rent of ${formattedAmount} for ${propertyName} - ${unitNumber} is due TODAY (${dueDate}). Please make payment immediately. - StableeApp`
  }
  if (daysUntilDue < 0) {
    return `Hello ${tenantName}, your rent of ${formattedAmount} for ${propertyName} - ${unitNumber} was due on ${dueDate} and is now OVERDUE. Please contact your landlord immediately. - StableeApp`
  }
  return `Hello ${tenantName}, your rent of ${formattedAmount} for ${propertyName} - ${unitNumber} is due on ${dueDate}. - StableeApp`
}

async function sendScheduledReminders() {
  console.log('Running scheduled reminders...')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const reminderDays = [30, 14, 7, 3, 1, 0, -3]

  for (const days of reminderDays) {
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + days)
    const targetDateStr = targetDate.toISOString().split('T')[0]

    const { data: tenants, error } = await supabase
      .from('tenants')
      .select('*, units!inner(unit_number, rent_amount, properties!inner(name, landlord_id))')
      .eq('next_due_date', targetDateStr)

    if (error) {
      console.error(`Error fetching tenants for day ${days}:`, error)
      continue
    }

    if (!tenants || tenants.length === 0) continue

    for (const tenant of tenants) {
      const { data: landlord } = await supabase
        .from('landlords')
        .select('plan')
        .eq('id', tenant.units.properties.landlord_id)
        .single()

      if (!landlord || landlord.plan === 'free') continue

      const todayStr = today.toISOString().split('T')[0]
      const { data: existingReminder } = await supabase
        .from('reminders')
        .select('id')
        .eq('tenant_id', tenant.id)
        .eq('status', 'sent')
        .gte('created_at', `${todayStr}T00:00:00.000Z`)

      if (existingReminder && existingReminder.length > 0) continue

      const message = buildReminderMessage(
        tenant.full_name,
        tenant.units.rent_amount,
        tenant.next_due_date,
        tenant.units.properties.name,
        tenant.units.unit_number,
        days
      )

      const result = await sendSMS(tenant.phone, message)

      await supabase.from('reminders').insert([{
        tenant_id: tenant.id,
        channel: 'sms',
        status: result.success ? 'sent' : 'failed',
        sent_at: new Date().toISOString(),
        message_id: result.data?.message_id || null
      }])

      console.log(`Reminder ${result.success ? 'sent' : 'failed'} to ${tenant.full_name} (${days} days)`)
    }
  }

  console.log('Scheduled reminders complete.')
}

function startScheduler() {
  cron.schedule('0 8 * * *', sendScheduledReminders, {
    timezone: 'Africa/Lagos'
  })
  console.log('Reminder scheduler started — runs daily at 8am Lagos time')
}

module.exports = { startScheduler, sendScheduledReminders }