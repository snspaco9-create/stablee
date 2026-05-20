const { supabaseAdmin } = require('../supabase')

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' })

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) return res.status(401).json({ error: 'Invalid or expired token.' })

    const { data: landlord } = await supabaseAdmin
      .from('landlords')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (!landlord) return res.status(404).json({ error: 'Landlord not found' })

    req.landlord = landlord
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' })
  }
}