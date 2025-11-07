import { useState, useContext } from 'react'
import { UserContext } from '../context/UserContext'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { user, logoutUser } = useContext(UserContext)

  const handleFileChange = (e) => setFile(e.target.files[0])

  const handleRemoveFile = (e) => {
    e.preventDefault()
    e.stopPropagation() // stops the click from triggering the file input
    setFile(null)
    setMessage('')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return setMessage('⚠️ Please select a PDF file first.')

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setMessage('✅ File uploaded successfully!')
        setFile(null)
      } else {
        setMessage(`⚠️ ${data.message || 'Upload failed.'}`)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setMessage('❌ Error connecting to server.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-page">
      {/* Profile Pill */}
      <div style={{ position: 'absolute', top: '20px', right: '40px' }}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            background: 'linear-gradient(90deg, #2077ff, #0054c2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '40px',
            boxShadow: '0 4px 12px rgba(32, 119, 255, 0.25)',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              color: '#0054c2',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {user?.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              : 'U'}
          </div>
          <span style={{ fontWeight: 600 }}>{user?.name || 'User'}</span>
        </div>

        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '60px',
              background: '#fff',
              borderRadius: '10px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              width: '200px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #eee',
                fontWeight: 600,
                color: '#003366',
              }}
            >
              👋 Hi, {user?.name?.split(' ')[0] || 'User'}
            </div>
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.95rem',
                color: '#0054c2',
                transition: 'background 0.2s ease',
              }}
              onMouseOver={(e) => (e.target.style.background = '#f0f6ff')}
              onMouseOut={(e) => (e.target.style.background = 'transparent')}
              onClick={() => alert('📜 Upload History coming soon!')}
            >
              📜 Upload History
            </button>
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.95rem',
                color: '#d11a2a',
                transition: 'background 0.2s ease',
              }}
              onMouseOver={(e) => (e.target.style.background = '#fff5f5')}
              onMouseOut={(e) => (e.target.style.background = 'transparent')}
              onClick={logoutUser}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="auth-container" style={{ marginTop: '120px', width: '420px' }}>
        <h2>Upload a PDF Document</h2>

        <form onSubmit={handleUpload} style={{ width: '100%', position: 'relative' }}>
          <label
            htmlFor="file-upload"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '160px',
              border: '2px dashed #2077ff',
              borderRadius: '12px',
              backgroundColor: '#f0f6ff',
              cursor: 'pointer',
              marginBottom: '20px',
              position: 'relative',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
            }}
          >
            {!file ? (
              <>
                <span style={{ fontSize: '3rem', color: '#2077ff' }}>+</span>
                <p style={{ color: '#003366', fontWeight: '600' }}>Click or Drop PDF here</p>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontWeight: '600',
                    color: '#003366',
                    textAlign: 'center',
                    maxWidth: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.name}
                </span>

                {/* Small blue 'x' in bottom-right corner */}
                <div
                  onClick={handleRemoveFile}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '22px',
                    height: '22px',
                    backgroundColor: '#e7f0ff',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2077ff',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 2px 6px rgba(32, 119, 255, 0.2)',
                    zIndex: 10,
                  }}
                  title="Remove file"
                >
                  ✕
                </div>
              </>
            )}
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 1,
              }}
            />
          </label>

          <button type="submit" className="form-btn" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  )
}
