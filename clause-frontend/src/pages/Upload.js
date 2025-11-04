import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../App.css'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setMessage('')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return setMessage('Please select a PDF file.')

    const formData = new FormData()
    formData.append('document', file)

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / e.total)),
      })
      setMessage(res.data.message)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Upload failed.')
    }
  }

  return (
    <div className="main-content">
      <div className="auth-container" style={{ width: '450px' }}>
        <h2>Upload a PDF Document</h2>
        <form onSubmit={handleUpload}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {progress > 0 && (
            <div style={{ width: '100%', background: '#e6ecf5', borderRadius: '6px', height: '10px', marginTop: '10px' }}>
              <div
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #2077ff, #0054c2)',
                  height: '10px',
                  borderRadius: '6px',
                  transition: 'width 0.3s ease',
                }}
              ></div>
            </div>
          )}
          <button type="submit" className="form-btn" style={{ marginTop: '18px' }}>
            Upload
          </button>
        </form>
        {message && (
          <p className="auth-message" style={{ marginTop: '20px' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
