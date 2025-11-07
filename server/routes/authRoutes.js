import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'

const router = express.Router()

// ✅ Password Strength Validation
const isStrongPassword = (password) => {
  const length = password.length >= 8
  const upper = /[A-Z]/.test(password)
  const lower = /[a-z]/.test(password)
  const number = /\d/.test(password)
  const symbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  return length && upper && lower && number && symbol
}

// ✅ Aadhaar Validation
const isValidAadhar = (aadhar) => /^[2-9]{1}[0-9]{11}$/.test(aadhar)

// 🧾 SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    let { name, email, aadhar, address, password } = req.body
    email = email?.toLowerCase().trim()

    if (!name || !email || !aadhar || !address || !password)
      return res.status(400).json({ message: 'All fields are required.' })

    if (!isValidAadhar(aadhar))
      return res.status(400).json({ message: 'Invalid Aadhaar number.' })

    if (!isStrongPassword(password))
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special symbol.',
      })

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: 'User already exists with this email.' })

    const existingAadhar = await User.findOne({ aadhar })
    if (existingAadhar)
      return res.status(400).json({ message: 'Aadhaar number already registered.' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      aadhar,
      address,
      password: hashedPassword,
      role: 'user', // 👤 default role
    })
    await newUser.save()

    res.status(201).json({ message: '✅ User registered successfully. Please log in.' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Server error during signup.' })
  }
})

// 🔐 LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body
    email = email?.toLowerCase().trim()

    if (!email || !password)
      return res.status(400).json({ message: 'Please enter all fields.' })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: 'User not found.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials.' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // 👑 Admin detection
    let loginMessage = '✅ Login successful!'
    if (user.role === 'admin') loginMessage = '👑 Welcome back, Admin!'

    res.status(200).json({
      message: loginMessage,
      token,
      user: {
        name: user.name,
        email: user.email,
        aadhar: user.aadhar,
        address: user.address,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login.' })
  }
})

export default router
