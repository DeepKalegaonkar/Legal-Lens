import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'

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

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar */}
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
          </ul>
        </nav>

        {/* Main Routes */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
