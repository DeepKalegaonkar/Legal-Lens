import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { loginUser } = useContext(UserContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(), // 🔹 Always lowercase
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ Save user globally and locally
        loginUser(data.user, data.token)
        setMessage('✅ Login successful! Redirecting...')

        // 🔹 Redirect based on role
        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin-home') // Admin gets their own dashboard
          } else {
            navigate('/upload')
          }
        }, 800)
      } else {
        setMessage(`⚠️ ${data.message || 'Invalid credentials.'}`)
      }
    } catch (err) {
      console.error('Login error:', err)
      setMessage('❌ Error connecting to server.')
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="form-btn">
          Login
        </button>
      </form>

      {message && <p className="auth-message">{message}</p>}
    </div>
  )
}
