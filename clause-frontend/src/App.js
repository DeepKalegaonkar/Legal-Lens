import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useContext } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Upload from './pages/Upload'
import AdminDashboard from './pages/AdminDashboard'
import AdminHome from './pages/AdminHome'
import UserHome from './pages/UserHome'
import { UserContext, UserProvider } from './context/UserContext'

//Navbar Component
function Navbar() {
  const location = useLocation()
  const { user, isLoggedIn, logoutUser } = useContext(UserContext)

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link
          to={
            isLoggedIn
              ? user?.role === 'admin'
                ? '/admin-home'
                : '/user-home'
              : '/'
          }
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

      {/* Navbar Links */}
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
            {/* Only show greeting if NOT on upload/admin pages */}
            {!['/upload', '/admin', '/admin-home', '/user-home'].includes(location.pathname) && (
              <li style={{ color: '#003366', fontWeight: 600 }}>
                👋 Hello, <span className="highlight">{user?.name}</span>{' '}
                <button
                  onClick={logoutUser}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2077ff',
                    cursor: 'pointer',
                    marginLeft: '5px',
                    textDecoration: 'underline',
                    fontWeight: 500,
                  }}
                >
                  Not you?
                </button>
              </li>
            )}
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

// ✅ Default Landing Page (for visitors)
function HomePage() {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useContext(UserContext)

  const handleGetStarted = () => {
    if (isLoggedIn) {
      if (user?.role === 'admin') navigate('/admin-home')
      else navigate('/user-home')
    } else {
      navigate('/signup')
    }
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
          Upload legal contracts and get clause classification and risk detection insights powered by advanced AI.
        </p>
        <button onClick={handleGetStarted} className="cta-btn">
          Get Started
        </button>
      </div>
    </div>
  )
}

// ✅ Protected Route
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(UserContext)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

// ✅ Main App
function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* User Pages */}
              <Route
                path="/user-home"
                element={
                  <ProtectedRoute>
                    <UserHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />

              {/* Admin Pages */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-home"
                element={
                  <ProtectedRoute>
                    <AdminHome />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
