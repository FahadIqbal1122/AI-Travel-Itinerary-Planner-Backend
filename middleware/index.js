const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const APP_SECRET = process.env.APP_SECRET

const hashPassword = async (password) => {
  let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  return hashedPassword
}

const comparePassword = async (storedPassword, password) => {
  let passwordMatch = await bcrypt.compare(password, storedPassword)
  return passwordMatch
}

const createToken = (payload) => {
  let token = jwt.sign(payload, APP_SECRET)
  return token
}

const stripToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (token) {
    res.locals.token = token
  }
  next()
}

const verifyToken = (req, res, next) => {
  try {
    const token = res.locals.token || req.headers.authorization?.split(" ")[1]
    console.log("Middleware token:", token) // Debug 1

    if (!token) return res.status(401).json({ message: "No token provided" })

    const decoded = jwt.verify(token, process.env.APP_SECRET)
    console.log("Decoded token:", decoded) // Debug 2

    if (!decoded.user) throw new Error("Token missing user data")

    req.user = decoded.user
    console.log("Attached user:", req.user) // Debug 3
    next()
  } catch (err) {
    console.error("VerifyToken error:", err)
    res.status(401).json({ message: err.message })
  }
}

module.exports = {
  stripToken,
  verifyToken,
  createToken,
  comparePassword,
  hashPassword,
}
