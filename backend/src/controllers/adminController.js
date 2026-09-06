const { supabaseAdmin: supabase } = require('../supabase')

exports.getOverview = async (req, res) => {
  const { data: landlords } = await supabase
    .from('landlords')
    .select('id, plan, created_at')

  const { data: payments } = await supabase
    .from('payments')
    .select('amount, created_at')

  const { data: properties } = await supabase
    .from('properties')
    .select('id')

  const { data: tenants } = await supabase
    .from('tenants')
    .select('id')

  const { data: reminders } = await supabase
    .from('reminders')
    .select('id, status')

  const totalLandlords = landlords?.length || 0
  const freePlan = landlords?.filter(l => l.plan === 'free').length || 0
  const starterPlan = landlords?.filter(l => l.plan === 'starter').length || 0
  const proPlan = landlords?.filter(l => l.plan === 'pro').length || 0
  const monthlyRevenue = (starterPlan * 3500) + (proPlan * 8000)
  const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  const sentReminders = reminders?.filter(r => r.status === 'sent').length || 0
  const failedReminders = reminders?.filter(r => r.status === 'failed').length || 0

  res.json({
    total_landlords: totalLandlords,
    free_plan: freePlan,
    starter_plan: starterPlan,
    pro_plan: proPlan,
    mrr: monthlyRevenue,
    total_revenue: totalRevenue,
    total_properties: properties?.length || 0,
    total_tenants: tenants?.length || 0,
    reminders_sent: sentReminders,
    reminders_failed: failedReminders
  })
}

exports.getLandlords = async (req, res) => {
  const { data, error } = await supabase
    .from('landlords')
    .select('id, full_name, email, phone, plan, created_at, is_admin')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.updateLandlordPlan = async (req, res) => {
  const { plan } = req.body
  const { id } = req.params

  if (!['free', 'starter', 'pro'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' })
  }

  const { data, error } = await supabase
    .from('landlords')
    .update({ plan })
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.getReminderLogs = async (req, res) => {
  const { data, error } = await supabase
    .from('reminders')
    .select('*, tenants(full_name, phone)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}