import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontSize: '14px' },
              success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
              error: { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
            }}
          />
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}