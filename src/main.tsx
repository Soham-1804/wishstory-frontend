import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            background: '#faf7f2',
            color: '#2c1a17',
            border: '1px solid rgba(200,169,126,0.3)',
            borderRadius: '2px',
            boxShadow: '0 8px 30px rgba(107,61,56,0.1)',
          },
          success: {
            iconTheme: { primary: '#6b3d38', secondary: '#faf7f2' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#faf7f2' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
