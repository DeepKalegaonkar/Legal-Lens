import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'

function HomePlaceholder() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 }}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/5353/5353345.png"
        alt="Legal Document"
        className="hero-image"
        onError={() => console.warn('Hero image failed to load')}
      />
      <div style={{ flex: 1 }}>
        <h1 style={{ color: '#003366', marginBottom: 12 }}>LegalLens</h1>
        <p style={{ color: '#333', fontSize: 18, lineHeight: 1.5 }}>
          Upload contracts and get multi-clause classification & risk detection.
          Sign up to try it out.
        </p>
      </div>
    </div>
  )
}

function App() {
  console.log('App mounted, REACT_APP_API_URL =', process.env.REACT_APP_API_URL)

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar" role="navigation" aria-label="Main navigation">
          <div className="navbar-logo">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5353/5353345.png"
              alt="Logo"
              width="40"
              height="40"
              onError={() => console.warn('Navbar logo failed to load')}
            />
            <span>LegalLens</span>
          </div>

          <ul className="nav-links nav-right" aria-hidden={false}>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePlaceholder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
