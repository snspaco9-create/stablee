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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://stablee.vercel.app/reset-password'
  })

  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Password reset email sent successfully' })
}

exports.resetPassword = async (req, res) => {
  const { password } = req.body
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'No token provided' })
  if (!password) return res.status(400).json({ error: 'Password is required' })

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
  if (userError || !user) return res.status(401).json({ error: 'Invalid token' })

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password }
  )

  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Password updated successfully' })
}
