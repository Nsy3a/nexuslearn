const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Missing token' })
  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'Invalid token' })
  req.user = payload
  next()
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = { signToken, verifyToken, authMiddleware, limiter }