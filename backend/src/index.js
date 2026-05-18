const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Stablee API is running' })
})

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Stablee backend running on port ${PORT}`)
})