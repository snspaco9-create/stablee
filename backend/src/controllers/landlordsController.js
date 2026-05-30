const { supabaseAdmin: supabase } = require('../supabase')

exports.updateProfile = async (req, res) => {
  const { full_name, phone } = req.body
  const landlord_id = req.landlord.id

  if (!full_name) return res.status(400).json({ error: 'Full name is required' })

  const { data, error } = await supabase
    .from('landlords')
    .update({ full_name, phone })
    .eq('id', landlord_id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.updateReminderPreferences = async (req, res) => {
  const { reminder_days } = req.body
  const landlord_id = req.landlord.id

  if (!Array.isArray(reminder_days)) {
    return res.status(400).json({ error: 'reminder_days must be an array' })
  }

  const { data, error } = await supabase
    .from('landlords')
    .update({ reminder_days })
    .eq('id', landlord_id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.getProfile = async (req, res) => {
  const { data, error } = await supabase
    .from('landlords')
    .select('*')
    .eq('id', req.landlord.id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}