import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Upload from './pages/Upload'

// ✅ Navbar Component
function Navbar({ user, isLoggedIn, onLogout }) {
  return (
    <nav className="navbar">
      {/* Logo + Brand */}
      <div className="navbar-logo">
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            gap: '10px',
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/8206/8206170.png"
            alt="LegalLens Logo"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
          <span>LegalLens</span>
        </Link>
      </div>

      {/* Links */}
      <ul
        className="nav-links"
        style={{
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '35px',
          marginLeft: 'auto',
        }}
      >
        {isLoggedIn ? (
          <>
            <li style={{ color: '#0054c2', fontWeight: 600 }}>
              👋 Welcome, <span className="highlight">{user?.name || 'User'}</span>
            </li>
            <li>
              <button
                onClick={onLogout}
                style={{
                  background: 'linear-gradient(90deg, #2077ff, #0054c2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(32, 119, 255, 0.25)',
                }}
                onMouseOver={(e) => (e.target.style.opacity = 0.9)}
                onMouseOut={(e) => (e.target.style.opacity = 1)}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                style={{
                  color: '#0054c2',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.color = '#2077ff')}
                onMouseOut={(e) => (e.target.style.color = '#0054c2')}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                style={{
                  color: '#0054c2',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.color = '#2077ff')}
                onMouseOut={(e) => (e.target.style.color = '#0054c2')}
              >
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

// ✅ Home Page
function HomePage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/signup')
  }

  return (
    <div className="home-section">
      <div className="home-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/8206/8206170.png"
          alt="Legal Document Illustration"
          className="hero-image"
        />
      </div>
      <div className="home-right">
        <h1>
          Welcome to <span className="highlight">LegalLens</span>
        </h1>
        <p>
          Upload legal contracts and get clause classification and risk detection
          insights powered by advanced AI.
        </p>
        <button onClick={handleGetStarted} className="cta-btn">
          Get Started
        </button>
      </div>
    </div>
  )
}

// ✅ Protected Route Wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

// ✅ Main App
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      setIsLoggedIn(true)
      setUser(JSON.parse(storedUser))
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* Main Routes */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ✅ Upload is protected */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
