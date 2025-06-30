const { User } = require("../models")
const middleware = require("../middleware")

const CheckSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    // Use _id consistently (changed from req.user.id)
    const user = await User.findById(req.user._id).select("-passwordDigest")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      user: {
        _id: user._id, // Consistent _id usage
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Session check error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (
      !user ||
      !(await middleware.comparePassword(user.passwordDigest, password))
    ) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Consistent _id usage in payload (changed from id)
    const payload = {
      _id: user._id,
      email: user.email,
    }

    const token = middleware.createToken(payload)

    res.json({
      user: {
        _id: user._id, // Consistent _id in response
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const Register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    const passwordDigest = await middleware.hashPassword(password)
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "A user with that email already exists",
      })
    }

    const user = await User.create({ name, email, passwordDigest })

    res.status(201).json({
      user: {
        _id: user._id, // Consistent _id in response
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Registration failed" })
  }
}

module.exports = {
  Login,
  Register,
  CheckSession,
}
