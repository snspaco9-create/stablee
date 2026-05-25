const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()
app.set('trust proxy', 1)

app.use(helmet())

app.use(cors({
  origin: ['http://localhost:5173', 'https://stablee.vercel.app'],
  credentials: true
}))

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use(globalLimiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again later.' }
})

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Stablee API is running' })
})

const authRoutes = require('./routes/auth')
app.use('/api/auth', authLimiter, authRoutes)

const propertyRoutes = require('./routes/properties')
app.use('/api/properties', propertyRoutes)

const unitRoutes = require('./routes/units')
app.use('/api/units', unitRoutes)

const tenantRoutes = require('./routes/tenants')
app.use('/api/tenants', tenantRoutes)

const paymentRoutes = require('./routes/payments')
app.use('/api/payments', paymentRoutes)

const reminderRoutes = require('./routes/reminders')
app.use('/api/reminders', reminderRoutes)

const receiptRoutes = require('./routes/receipts')
app.use('/api/receipts', receiptRoutes)

const subscriptionRoutes = require('./routes/subscriptions')
app.use('/api/subscriptions', subscriptionRoutes)

const landlordRoutes = require('./routes/landlords')
app.use('/api/landlords', landlordRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Stablee backend running on port ${PORT}`)
})