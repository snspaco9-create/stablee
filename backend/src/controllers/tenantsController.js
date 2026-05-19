const supabase = require('../supabase')

function calculateNextDueDate(leaseStart, paymentCycle) {
  const date = new Date(leaseStart)
  switch (paymentCycle) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'quarterly':
      date.setMonth(date.getMonth() + 3)
      break
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1)
      break
    default:
      date.setMonth(date.getMonth() + 1)
  }
  return date.toISOString().split('T')[0]
}

exports.getTenants = async (req, res) => {
  const landlord_id = req.landlord.id

  const { data, error } = await supabase
    .from('tenants')
    .select('*, units!inner(unit_number, rent_amount, payment_cycle, properties!inner(name, landlord_id))')
    .eq('units.properties.landlord_id', landlord_id)
    .order('full_name', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}
exports.createTenant = async (req, res) => {
  const { unit_id, full_name, phone, email, lease_start, lease_end } = req.body

  if (!unit_id || !full_name || !phone || !lease_start) {
    return res.status(400).json({ error: 'unit_id, full_name, phone and lease_start are required' })
  }

  const { data: unit, error: unitError } = await supabase
    .from('units')
    .select('payment_cycle')
    .eq('id', unit_id)
    .single()

  if (unitError || !unit) return res.status(404).json({ error: 'Unit not found' })

  const next_due_date = calculateNextDueDate(lease_start, unit.payment_cycle)

  const { data, error } = await supabase
    .from('tenants')
    .insert([{ unit_id, full_name, phone, email, lease_start, lease_end, next_due_date }])
    .select('*')

  if (error) {
    console.error('Insert error:', error)
    return res.status(500).json({ error: error.message })
  }

  if (!data || data.length === 0) {
    return res.status(500).json({ error: 'Tenant was not created' })
  }

  await supabase
    .from('units')
    .update({ status: 'occupied' })
    .eq('id', unit_id)

  res.status(201).json(data[0])
}

exports.updateTenant = async (req, res) => {
  const { full_name, phone, email, lease_end, next_due_date } = req.body

  const { data, error } = await supabase
    .from('tenants')
    .update({ full_name, phone, email, lease_end, next_due_date })
    .eq('id', req.params.id)
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  if (!data || data.length === 0) return res.status(404).json({ error: 'Tenant not found' })
  res.json(data[0])
}

exports.deleteTenant = async (req, res) => {
  const { data: tenant } = await supabase
    .from('tenants')
    .select('unit_id')
    .eq('id', req.params.id)
    .single()

  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })

  if (tenant?.unit_id) {
    await supabase
      .from('units')
      .update({ status: 'vacant' })
      .eq('id', tenant.unit_id)
  }

  res.json({ message: 'Tenant deleted and unit set to vacant' })
}