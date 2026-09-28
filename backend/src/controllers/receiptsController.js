const { supabaseAdmin: supabase } = require('../supabase')
const { generateReceipt } = require('../services/pdf')

exports.downloadReceipt = async (req, res) => {
  const { payment_id } = req.params
  const landlord = req.landlord

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', payment_id)
    .single()

  if (error || !payment) return res.status(404).json({ error: 'Payment not found' })

  // Ownership check: skip only for the special 'portal' caller (e.g. tenant portal),
  // otherwise verify the payment belongs to this landlord's property.
  if (landlord.id !== 'portal') {
    const { data: ownerCheck } = await supabase
      .from('payments')
      .select('id, tenants!inner(units!inner(properties!inner(landlord_id)))')
      .eq('id', payment_id)
      .eq('tenants.units.properties.landlord_id', landlord.id)
      .single()

    if (!ownerCheck) return res.status(403).json({ error: 'Access denied to this receipt' })
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', payment.tenant_id)
    .single()

  const { data: unit } = await supabase
    .from('units')
    .select('*')
    .eq('id', payment.unit_id)
    .single()

  if (!unit) return res.status(404).json({ error: 'Unit not found for this payment' })

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', unit.property_id)
    .single()

  const { data: landlordData } = await supabase
    .from('landlords')
    .select('*')
    .eq('id', property.landlord_id)
    .single()

  try {
    const pdfBuffer = await generateReceipt(payment, tenant, unit, property, landlordData)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${payment_id.slice(0, 8)}.pdf"`)
    res.send(pdfBuffer)
  } catch (err) {
    console.error('PDF error:', err)
    res.status(500).json({ error: 'Failed to generate receipt' })
  }
}