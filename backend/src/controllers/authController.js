const { supabase, supabaseAdmin } = require('../supabase')

exports.register = async (req, res) => {
  const { full_name, email, phone, password } = req.body

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })

  if (authError) return res.status(400).json({ error: authError.message })

  const { data: landlord, error: landlordError } = await supabaseAdmin
    .from('landlords')
    .insert([{
      full_name,
      email,
      phone,
      auth_id: authData.user.id,
      plan: 'free'
    }])
    .select()
    .single()

  if (landlordError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return res.status(500).json({ error: landlordError.message })
  }

  res.status(201).json({
    token: authData.session?.access_token,
    refresh_token: authData.session?.refresh_token,
    landlord: {
      id: landlord.id,
      full_name: landlord.full_name,
      email: landlord.email,
      plan: landlord.plan
    }
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (authError) return res.status(401).json({ error: 'Invalid email or password' })

  const { data: landlord, error: landlordError } = await supabaseAdmin
    .from('landlords')
    .select('*')
    .eq('auth_id', authData.user.id)
    .single()

  if (landlordError || !landlord) {
    return res.status(404).json({ error: 'Landlord profile not found' })
  }

  res.json({
    token: authData.session.access_token,
    refresh_token: authData.session.refresh_token,
    landlord: {
      id: landlord.id,
      full_name: landlord.full_name,
      email: landlord.email,
      plan: landlord.plan
    }
  })
}