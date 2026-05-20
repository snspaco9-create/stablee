const { supabaseAdmin: supabase } = require('../supabase')
const { generateReceipt } = require('../services/pdf')

exports.downloadReceipt = async (req, res) => {
  const { payment_id } = req.params

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', payment_id)
    .single()

  if (error || !payment) return res.status(404).json({ error: 'Payment not found' })

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

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', unit.property_id)
    .single()

  const { data: landlord } = await supabase
    .from('landlords')
    .select('*')
    .eq('id', property.landlord_id)
    .single()

  try {
    const pdfBuffer = await generateReceipt(payment, tenant, unit, property, landlord)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${payment_id.slice(0, 8)}.pdf"`)
    res.send(pdfBuffer)
  } catch (err) {
    console.error('PDF error:', err)
    res.status(500).json({ error: 'Failed to generate receipt' })
  }
}