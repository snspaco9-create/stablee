module.exports = (req, res, next) => {
  if (!req.landlord || !req.landlord.is_admin) {
    return res.status(403).json({ error: 'Admin access only' })
  }
  next()
}