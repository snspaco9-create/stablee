const supabase = require('../supabase')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  const { full_name, email, phone, password } = req.body

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }

  const { data: existing } = await supabase
    .from('landlords')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return res.status(400).json({ error: 'Email already registered' })
  }

  const password_hash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('landlords')
    .insert([{ full_name, email, phone, password_hash }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const token = jwt.sign(
    { id: data.id, email: data.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.status(201).json({ token, landlord: { id: data.id, full_name: data.full_name, email: data.email } })
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const { data: landlord } = await supabase
    .from('landlords')
    .select('*')
    .eq('email', email)
    .single()

  if (!landlord) return res.status(401).json({ error: 'Invalid email or password' })

  const valid = await bcrypt.compare(password, landlord.password_hash)
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  const token = jwt.sign(
    { id: landlord.id, email: landlord.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token, landlord: { id: landlord.id, full_name: landlord.full_name, email: landlord.email } })
}