const axios = require('axios')
const { supabaseAdmin } = require('../supabase')
require('dotenv').config()

const PLAN_PRICES = {
  starter: 350000,
  pro: 800000
}

exports.initializePayment = async (req, res) => {
  const { plan } = req.body
  const landlord = req.landlord

  if (!PLAN_PRICES[plan]) {
    return res.status(400).json({ error: 'Invalid plan' })
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: landlord.email,
        amount: PLAN_PRICES[plan],
        currency: 'NGN',
        reference: `stablee_${landlord.id}_${Date.now()}`,
        callback_url: `https://stablee.onrender.com/api/subscriptions/verify`,
        metadata: {
          landlord_id: landlord.id,
          plan,
          cancel_action: 'https://stablee.vercel.app/pricing'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference
    })
  } catch (err) {
    console.error('Paystack error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to initialize payment' })
  }
}

exports.verifyPayment = async (req, res) => {
  const { reference } = req.query

  if (!reference) {
    return res.redirect('https://stablee.vercel.app/pricing?error=no_reference')
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    )

    const { status, metadata } = response.data.data

    if (status === 'success') {
      const { landlord_id, plan } = metadata

      await supabaseAdmin
        .from('landlords')
        .update({ plan })
        .eq('id', landlord_id)

      return res.redirect(`https://stablee.vercel.app/?payment=success&plan=${plan}`)
    }

    res.redirect('https://stablee.vercel.app/pricing?error=payment_failed')
  } catch (err) {
    console.error('Verify error:', err.response?.data || err.message)
    res.redirect('https://stablee.vercel.app/pricing?error=verify_failed')
  }
}