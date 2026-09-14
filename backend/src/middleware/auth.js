const { supabaseAdmin } = require('../supabase')

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        error: 'No token provided'
      })
    }

    const {
      data: { user },
      error: userError
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return res.status(401).json({
        error: 'Invalid or expired token'
      })
    }

    const { data: landlord, error: landlordError } =
      await supabaseAdmin
        .from('landlords')
        .select('*')
        .eq('auth_id', user.id)
        .single()

    if (landlordError || !landlord) {
      return res.status(404).json({
        error: 'Landlord profile not found'
      })
    }

    req.landlord = landlord
    req.user = user

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)

    return res.status(500).json({
      error: 'Authentication failed'
    })
  }
}

module.exports = auth