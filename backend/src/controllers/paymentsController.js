const { supabaseAdmin: supabase } = require('../supabase')

function advanceDueDate(currentDueDate, paymentCycle) {
  const date = new Date(currentDueDate)
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

exports.getPayments = async (req, res) => {
  const landlord_id = req.landlord.id
  const { tenant_id } = req.query

  let query = supabase
    .from('payments')
    .select('*, tenants!inner(full_name, phone, units!inner(unit_number, payment_cycle, properties!inner(name, landlord_id))))')
    .eq('tenants.units.properties.landlord_id', landlord_id)
    .order('payment_date', { ascending: false })

  if (tenant_id) query = query.eq('tenant_id', tenant_id)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.createPayment = async (req, res) => {
  const { tenant_id, unit_id, amount, method, payment_date } = req.body

  if (!tenant_id || !unit_id || !amount) {
    return res.status(400).json({ error: 'tenant_id, unit_id and amount are required' })
  }

  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('*, units(payment_cycle)')
    .eq('id', tenant_id)
    .single()

  if (tenantError || !tenant) return res.status(404).json({ error: 'Tenant not found' })

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert([{
      tenant_id,
      unit_id,
      amount,
      method: method || 'cash',
      payment_date: payment_date || new Date().toISOString().split('T')[0],
      status: 'paid'
    }])
    .select('*')

  if (paymentError) {
    console.error('Payment error:', paymentError)
    return res.status(500).json({ error: paymentError.message })
  }

  const new_due_date = advanceDueDate(
    tenant.next_due_date,
    tenant.units.payment_cycle
  )

  await supabase
    .from('tenants')
    .update({ next_due_date: new_due_date })
    .eq('id', tenant_id)

  res.status(201).json({
    payment: payment[0],
    next_due_date: new_due_date
  })
}

exports.getDashboardSummary = async (req, res) => {
  const landlord_id = req.landlord.id

  const { data: units, error: unitsError } = await supabase
    .from('units')
    .select('id, rent_amount, status, properties!inner(landlord_id)')
    .eq('properties.landlord_id', landlord_id)
    .eq('status', 'occupied')

  if (unitsError) return res.status(500).json({ error: unitsError.message })

  const expected = units.reduce((sum, u) => sum + u.rent_amount, 0)

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const unitIds = units.map(u => u.id)

  let collected = 0
  let paidUnitIds = []

  if (unitIds.length > 0) {
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount, unit_id')
      .in('unit_id', unitIds)
      .eq('status', 'paid')
      .gte('payment_date', startOfMonth.toISOString().split('T')[0])

    if (paymentsError) return res.status(500).json({ error: paymentsError.message })
    collected = payments.reduce((sum, p) => sum + p.amount, 0)
    paidUnitIds = [...new Set(payments.map(p => p.unit_id))]
  }

  const unpaidUnits = units.filter(u => !paidUnitIds.includes(u.id))
  const outstanding = unpaidUnits.reduce((sum, u) => sum + u.rent_amount, 0)
  const paidCount = paidUnitIds.length
  const unpaidCount = unpaidUnits.length

  const { data: overdue, error: overdueError } = await supabase
    .from('tenants')
    .select('id, full_name, phone, next_due_date, unit_id, units!inner(properties!inner(landlord_id))')
    .eq('units.properties.landlord_id', landlord_id)
    .lt('next_due_date', new Date().toISOString().split('T')[0])

  if (overdueError) return res.status(500).json({ error: overdueError.message })

  const { data: upcoming } = await supabase
    .from('tenants')
    .select('id, full_name, phone, next_due_date, units!inner(unit_number, properties!inner(name, landlord_id))')
    .eq('units.properties.landlord_id', landlord_id)
    .gte('next_due_date', new Date().toISOString().split('T')[0])
    .lte('next_due_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

  res.json({
    expected,
    collected,
    outstanding,
    paid_count: paidCount,
    unpaid_count: unpaidCount,
    total_units: units.length,
    overdue_count: overdue?.length || 0,
    overdue_tenants: overdue || [],
    upcoming_due: upcoming || []
  })
}

exports.deletePayment = async (req, res) => {
  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (fetchError || !payment) return res.status(404).json({ error: 'Payment not found' })

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*, units(payment_cycle)')
    .eq('id', payment.tenant_id)
    .single()

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })

  if (tenant) {
    const prevDate = new Date(tenant.next_due_date)
    switch (tenant.units.payment_cycle) {
      case 'monthly': prevDate.setMonth(prevDate.getMonth() - 1); break
      case 'quarterly': prevDate.setMonth(prevDate.getMonth() - 3); break
      case 'yearly': prevDate.setFullYear(prevDate.getFullYear() - 1); break
      default: prevDate.setMonth(prevDate.getMonth() - 1)
    }
    await supabase
      .from('tenants')
      .update({ next_due_date: prevDate.toISOString().split('T')[0] })
      .eq('id', payment.tenant_id)
  }

  res.json({ message: 'Payment deleted and due date reversed' })
}