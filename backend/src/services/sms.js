const axios = require('axios')
require('dotenv').config()

async function sendSMS(phone, message) {
  const formattedPhone = phone.replace(/^0/, '234')

  try {
    const response = await axios.post('https://v3.api.termii.com/api/sms/send', {
      to: formattedPhone,
      from: process.env.TERMII_SENDER_ID,
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: process.env.TERMII_API_KEY
    })
    return { success: true, data: response.data }
  } catch (err) {
    console.error('SMS error:', err.response?.data || err.message)
    return { success: false, error: err.response?.data?.message || err.message }
  }
}

module.exports = { sendSMS }