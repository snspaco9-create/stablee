const { supabaseAdmin: supabase } = require('../supabase')

exports.getUnits = async (req, res) => {
  const { data, error } = await supabase
    .from('units')
    .select('*, tenants(*)')
    .eq('property_id', req.params.property_id)
    .order('unit_number', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.createUnit = async (req, res) => {
  const { property_id, unit_number, rent_amount, payment_cycle } = req.body
  const landlord = req.landlord

  if (!property_id || !unit_number || !rent_amount) {
    return res.status(400).json({ error: 'property_id, unit_number and rent_amount are required' })
  }

  if (landlord.plan === 'free') {
    const { data: existing } = await supabase
      .from('units')
      .select('id, properties!inner(landlord_id)')
      .eq('properties.landlord_id', landlord.id)

    if (existing && existing.length >= 5) {
      return res.status(403).json({
        error: 'Free plan allows only 5 units. Upgrade to add more.',
        upgrade: true
      })
    }
  }

  if (landlord.plan === 'starter') {
    const { data: existing } = await supabase
      .from('units')
      .select('id, properties!inner(landlord_id)')
      .eq('properties.landlord_id', landlord.id)

    if (existing && existing.length >= 30) {
      return res.status(403).json({
        error: 'Starter plan allows only 30 units. Upgrade to Pro for unlimited.',
        upgrade: true
      })
    }
  }

  const { data, error } = await supabase
    .from('units')
    .insert([{ property_id, unit_number, rent_amount, payment_cycle: payment_cycle || 'monthly' }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
}

exports.updateUnit = async (req, res) => {
  const { unit_number, rent_amount, payment_cycle, status } = req.body

  const { data, error } = await supabase
    .from('units')
    .update({ unit_number, rent_amount, payment_cycle, status })
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'Unit not found' })
  res.json(data)
}

exports.deleteUnit = async (req, res) => {
  const { error } = await supabase
    .from('units')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Unit deleted' })
}