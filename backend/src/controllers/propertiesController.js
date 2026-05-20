const { supabaseAdmin: supabase } = require('../supabase')

exports.getProperties = async (req, res) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*, units(count)')
    .eq('landlord_id', req.landlord.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.createProperty = async (req, res) => {
  const { name, address, city } = req.body

  if (!name) return res.status(400).json({ error: 'Property name is required' })

  const { data, error } = await supabase
    .from('properties')
    .insert([{ name, address, city, landlord_id: req.landlord.id }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
}

exports.updateProperty = async (req, res) => {
  const { name, address, city } = req.body

  const { data, error } = await supabase
    .from('properties')
    .update({ name, address, city })
    .eq('id', req.params.id)
    .eq('landlord_id', req.landlord.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'Property not found' })
  res.json(data)
}

exports.deleteProperty = async (req, res) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', req.params.id)
    .eq('landlord_id', req.landlord.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Property deleted' })
}